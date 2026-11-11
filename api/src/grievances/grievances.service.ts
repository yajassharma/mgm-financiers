import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Grievance, GrievanceDocument } from './schema/grievances.schema';
import { Model, PipelineStage } from 'mongoose';
import { makeResponse } from 'src/common/helpers/response.helper';
import { paginate } from 'src/common/helpers/pagination.helper';
import { escapeRegex } from 'src/common/helpers/regex.helper';
import { EmailNotificationService } from '../notifications/email-notification.service';
import { OtpService } from 'src/auth/otp/otp.service';

@Injectable()
export class GrievancesService {
  private readonly logger = new Logger(GrievancesService.name);

  constructor(
    @InjectModel(Grievance.name) readonly model: Model<GrievanceDocument>,
    private readonly emailNotifications: EmailNotificationService,
    private readonly otpService: OtpService,
  ) {}

  async sendGrievanceOtp(phone: string) {
    return this.otpService.sendGrievanceOtp(phone);
  }

  async checkGrievanceOtp(phone: string, otp: string) {
    return this.otpService.checkGrievanceOtp(phone, otp);
  }

  async createGrievance(body: any) {
    const { name, customerName, email, mobile, phone, category, subject, description, loanType, loanAccountNumber, address, phoneOtp } = body;
    if (!email || !subject || !description) {
      return makeResponse({
        statusCode: 400, title: 'Error',
        message: 'Email, subject, and description are required.',
        status: 'error',
      });
    }

    const mobileNumber = (mobile || phone || '').toString().trim();
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return makeResponse({
        statusCode: 400, title: 'Error',
        message: 'A valid 10-digit Indian mobile number is required.',
        status: 'error',
      });
    }

    if (!phoneOtp) {
      return makeResponse({
        statusCode: 400, title: 'OTP Required',
        message: 'Please verify your mobile number with an OTP before submitting.',
        status: 'error',
      });
    }

    // OTP is single-use — consume it atomically before creating the record
    const consumed = await this.otpService.consumeGrievanceOtp(mobileNumber, phoneOtp);
    if (consumed.statusCode !== 200) return consumed;

    const now = new Date();
    const grievance = await this.model.create({
      name: name || customerName || 'Anonymous',
      email,
      mobile: mobileNumber,
      mobileVerified: true,
      category: category || loanType || 'General',
      subject,
      description,
      loanAccountNumber: loanAccountNumber || '',
      address: address || '',
      statusHistory: [{ timestamp: now, status: 'RECEIVED', note: 'Grievance submitted' }],
    });

    // Send email notification (fire-and-forget)
    this.emailNotifications.sendGrievanceNew({
      grievanceId: grievance.grievanceId,
      name: grievance.name,
      email: grievance.email,
      mobile: grievance.mobile,
      category: grievance.category,
      subject: grievance.subject,
      createdAt: now,
    }).catch(err => this.logger.error(`Grievance notification failed for ${grievance.grievanceId}: ${err.message}`));

    return makeResponse({
      statusCode: 201, title: 'Grievance Submitted',
      message: 'Your grievance has been registered successfully.',
      status: 'success', data: grievance,
    });
  }

  async trackByEmail(body: { email: string }) {
    const grievances = await this.model.find({ email: body.email }).sort({ _id: -1 });
    return makeResponse({
      statusCode: 200, title: 'Grievances Found',
      message: 'Grievances retrieved successfully.', status: 'success', data: grievances,
    });
  }

  async trackById(grievanceId: string) {
    const grievance = await this.model.findOne({ grievanceId });
    if (!grievance) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Grievance not found.', status: 'error' });
    }
    return makeResponse({ statusCode: 200, title: 'Grievance Found', message: 'Success', status: 'success', data: grievance });
  }

  async findAll(search?: string, status?: string, page = 1, limit = 10) {
    const stages: PipelineStage[] = [];
    if (search) {
      const safeSearch = escapeRegex(search);
      stages.push({ $match: { $or: [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { mobile: { $regex: safeSearch, $options: 'i' } },
        { grievanceId: { $regex: safeSearch, $options: 'i' } },
        { subject: { $regex: safeSearch, $options: 'i' } },
      ]}});
    }
    if (status && status !== 'all') {
      stages.push({ $match: { status } });
    }
    const result = await paginate(this.model, {}, { page, limit, sort: { _id: -1 } }, stages);
    return makeResponse({ status: 'success', message: 'Data found', statusCode: 200, title: 'Data Found', data: result });
  }

  async updateStatus(id: string, body: { status?: string; customerUpdate?: string; internalNotes?: string }) {
    const grievance = await this.model.findById(id);
    if (!grievance) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Grievance not found.', status: 'error' });
    }

    const previousStatus = grievance.status;
    const now = new Date();
    if (body.status) grievance.status = body.status;
    if (body.customerUpdate) grievance.customerUpdate = body.customerUpdate;
    if (body.internalNotes) grievance.internalNotes = body.internalNotes;
    grievance.statusHistory.push({
      timestamp: now,
      status: body.status || grievance.status,
      note: body.customerUpdate || `Status updated to ${body.status || grievance.status}`,
    });
    await grievance.save();

    // Send email notification on status change (fire-and-forget)
    if (body.status && body.status !== previousStatus) {
      this.emailNotifications.sendGrievanceUpdate({
        grievanceId: grievance.grievanceId,
        name: grievance.name,
        previousStatus,
        newStatus: body.status,
        updateNote: body.customerUpdate || '',
        updatedAt: now,
      }).catch(err => this.logger.error(`Grievance update notification failed for ${grievance.grievanceId}: ${err.message}`));
    }

    return makeResponse({ statusCode: 200, title: 'Updated', message: 'Status updated successfully.', status: 'success', data: grievance });
  }

  async addFollowUp(grievanceId: string, body: { name: string; email: string; message: string }) {
    const grievance = await this.model.findOne({ grievanceId });
    if (!grievance) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Grievance not found.', status: 'error' });
    }

    const { name, email, message } = body;
    if (!message || !message.trim()) {
      return makeResponse({ statusCode: 400, title: 'Bad Request', message: 'Message is required.', status: 'error' });
    }

    // Per-grievance cap: 5 follow-ups per 24h
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentFollowUps = (grievance.followUps || []).filter((f: any) => new Date(f.timestamp) >= dayAgo);
    if (recentFollowUps.length >= 5) {
      return makeResponse({
        statusCode: 429, title: 'Too Many Follow-ups',
        message: 'Maximum 5 follow-ups per grievance per day. Please try again later.',
        status: 'error',
      });
    }

    // Total follow-up cap per grievance: 10 lifetime
    if ((grievance.followUps || []).length >= 10) {
      return makeResponse({
        statusCode: 429, title: 'Limit Reached',
        message: 'This grievance has reached the maximum number of follow-ups. Please contact support.',
        status: 'error',
      });
    }

    const now = new Date();

    grievance.followUps.push({
      timestamp: now,
      message: message.trim(),
      name: name || grievance.name,
      email: email || grievance.email,
    });
    await grievance.save();

    // Send email notification (fire-and-forget)
    this.emailNotifications.sendGrievanceFollowUp({
      grievanceId: grievance.grievanceId,
      name: name || grievance.name,
      email: email || grievance.email,
      message: message.trim(),
      currentStatus: grievance.status,
      createdAt: now,
    }).catch(err => this.logger.error(`Grievance follow-up notification failed for ${grievance.grievanceId}: ${err.message}`));

    return makeResponse({ statusCode: 200, title: 'Follow-up Added', message: 'Your follow-up has been submitted.', status: 'success', data: grievance });
  }

  async getStats() {
    const [total, received, inReview, pendingCustomer, resolved, closed] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: 'RECEIVED' }),
      this.model.countDocuments({ status: 'IN_REVIEW' }),
      this.model.countDocuments({ status: 'PENDING_CUSTOMER' }),
      this.model.countDocuments({ status: 'RESOLVED' }),
      this.model.countDocuments({ status: 'CLOSED' }),
    ]);
    return makeResponse({ statusCode: 200, title: 'Stats', message: 'Stats retrieved.', status: 'success', data: { total, open: received, inReview, pendingCustomer, resolved, closed } });
  }
}
