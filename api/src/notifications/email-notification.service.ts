import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resend } from 'resend';
import { NotificationLog, NotificationLogDocument } from './schema/notification-log.schema';
import {
  paymentSuccessEmail,
  grievanceNewEmail,
  grievanceUpdateEmail,
  grievanceFollowUpEmail,
  leadNewEmail,
} from './email-templates';

@Injectable()
export class EmailNotificationService implements OnModuleInit {
  private readonly logger = new Logger(EmailNotificationService.name);
  private resend!: Resend;
  private fromEmail = '';
  private adminEmail = '';
  private enabled = false;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(NotificationLog.name)
    private readonly logModel: Model<NotificationLogDocument>,
  ) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('resendApiKey');
    this.fromEmail = this.config.get<string>('resendFromEmail') || 'MGM Financiers <notifications@mgmfinanciers.com>';
    this.adminEmail = this.config.get<string>('mgmNotificationEmail') || 'notifications@mgmfinanciers.com';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set — email notifications disabled');
      return;
    }

    this.resend = new Resend(apiKey);
    this.enabled = true;
    this.logger.log('Resend email notifications enabled');
  }

  // ─── Idempotency gate ──────────────────────────────────────────────
  private async shouldSend(notificationType: string, relatedId: string): Promise<boolean> {
    const existing = await this.logModel.findOne({ notificationType, relatedId });
    if (existing && existing.status === 'sent') {
      this.logger.debug(`Skipping duplicate ${notificationType} for ${relatedId}`);
      return false;
    }
    return true;
  }

  private async logAttempt(
    notificationType: string,
    relatedId: string,
    recipientEmail: string,
    status: string,
    providerMessageId?: string,
    failureReason?: string,
    subject?: string,
  ) {
    try {
      await this.logModel.findOneAndUpdate(
        { notificationType, relatedId },
        {
          notificationType,
          relatedId,
          recipientEmail,
          status,
          providerMessageId,
          failureReason,
          subject,
        },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      this.logger.error(`Failed to write notification log: ${err.message}`);
    }
  }

  // ─── Send helper ───────────────────────────────────────────────────
  private async send(to: string, subject: string, html: string, notificationType: string, relatedId: string) {
    if (!this.enabled) return;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend error for ${notificationType}/${relatedId}: ${error.message}`);
        await this.logAttempt(notificationType, relatedId, to, 'failed', undefined, error.message, subject);
        return;
      }

      this.logger.log(`Email sent: ${notificationType} → ${to} (id=${data?.id})`);
      await this.logAttempt(notificationType, relatedId, to, 'sent', data?.id, undefined, subject);
    } catch (err: any) {
      this.logger.error(`Email send failed for ${notificationType}/${relatedId}: ${err.message}`);
      await this.logAttempt(notificationType, relatedId, to, 'failed', undefined, err.message, subject);
    }
  }

  // ─── Payment success notification ──────────────────────────────────
  async sendPaymentSuccess(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    paymentType: string;
    orderId: string;
    cfPaymentId: string;
    paidAt: Date;
    paymentMethod: string;
  }) {
    if (!(await this.shouldSend('PAYMENT_SUCCESS', data.orderId))) return;

    const html = paymentSuccessEmail({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      amount: data.amount,
      paymentType: data.paymentType,
      orderId: data.orderId,
      paidAt: data.paidAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      paymentMethod: data.paymentMethod,
    });

    // Send to customer (skip no-email placeholders)
    if (data.customerEmail && !data.customerEmail.startsWith('noemail-')) {
      await this.send(data.customerEmail, `Payment Confirmation — ₹${data.amount.toLocaleString('en-IN')} | MGM Financiers`, html, 'PAYMENT_SUCCESS', data.orderId);
    }

    // Always notify admin
    await this.send(this.adminEmail, `Payment Received — ₹${data.amount.toLocaleString('en-IN')} (${data.customerName})`, html, 'PAYMENT_SUCCESS', data.orderId);
  }

  // ─── Grievance new notification ────────────────────────────────────
  async sendGrievanceNew(data: {
    grievanceId: string;
    name: string;
    email: string;
    mobile: string;
    category: string;
    subject: string;
    createdAt: Date;
  }) {
    if (!(await this.shouldSend('GRIEVANCE_NEW', data.grievanceId))) return;

    const html = grievanceNewEmail({
      grievanceId: data.grievanceId,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      category: data.category,
      subject: data.subject,
      createdAt: data.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    await this.send(this.adminEmail, `New Grievance — ${data.grievanceId} (${data.subject})`, html, 'GRIEVANCE_NEW', data.grievanceId);
  }

  // ─── Grievance update notification ─────────────────────────────────
  async sendGrievanceUpdate(data: {
    grievanceId: string;
    name: string;
    previousStatus: string;
    newStatus: string;
    updateNote: string;
    updatedAt: Date;
  }) {
    const key = `${data.grievanceId}-${data.newStatus}`;
    if (!(await this.shouldSend('GRIEVANCE_UPDATE', key))) return;

    const html = grievanceUpdateEmail({
      grievanceId: data.grievanceId,
      name: data.name,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      updateNote: data.updateNote,
      updatedAt: data.updatedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    await this.send(this.adminEmail, `Grievance Updated — ${data.grievanceId} → ${data.newStatus}`, html, 'GRIEVANCE_UPDATE', key);
  }

  // ─── Grievance follow-up notification ─────────────────────────────
  async sendGrievanceFollowUp(data: {
    grievanceId: string;
    name: string;
    email: string;
    message: string;
    currentStatus: string;
    createdAt: Date;
  }) {
    const key = `${data.grievanceId}-followup-${data.createdAt.getTime()}`;
    if (!(await this.shouldSend('GRIEVANCE_FOLLOW_UP', key))) return;

    const html = grievanceFollowUpEmail({
      grievanceId: data.grievanceId,
      name: data.name,
      email: data.email,
      message: data.message,
      currentStatus: data.currentStatus,
      createdAt: data.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    await this.send(this.adminEmail, `Customer Follow-up — ${data.grievanceId} (${data.name})`, html, 'GRIEVANCE_FOLLOW_UP', key);
  }

  // ─── Lead notification ─────────────────────────────────────────────
  async sendLeadNew(data: {
    leadId: string;
    name: string;
    phone: string;
    email: string;
    loanType: string;
    amount: number;
    cibil: string;
    employment: string;
    purpose: string;
    createdAt: Date;
  }) {
    if (!(await this.shouldSend('LEAD_NEW', data.leadId))) return;

    const html = leadNewEmail({
      leadId: data.leadId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      loanType: data.loanType,
      amount: data.amount,
      cibil: data.cibil,
      employment: data.employment,
      purpose: data.purpose,
      createdAt: data.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    await this.send(this.adminEmail, `New Lead — ${data.name} (${data.loanType})`, html, 'LEAD_NEW', data.leadId);
  }
}
