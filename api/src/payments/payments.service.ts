import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment, PaymentDocument } from "./schema/payments.schema";
import { Model, PipelineStage } from "mongoose";
import { makeResponse } from "../common/helpers/response.helper";
import { paginate } from "../common/helpers/pagination.helper";
import { escapeRegex } from "../common/helpers/regex.helper";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name) readonly model: Model<PaymentDocument>,
    private readonly config: ConfigService,
  ) {}

  private getCashfreeConfig() {
    const appId = this.config.get<string>("cashfreeAppId") || "";
    const secretKey = this.config.get<string>("cashfreeSecretKey") || "";
    const isTest = appId.startsWith("TEST");
    const apiVersion = "2023-08-01";
    const baseUrl = isTest ? "https://sandbox.cashfree.com/pg" : "https://api.cashfree.com/pg";
    return { appId, secretKey, apiVersion, baseUrl, isTest };
  }

  async createOrder(body: any) {
    const { customerName, customerEmail, customerPhone, borrowerName, phone, email, amount, paymentType, loanAccountNumber, loanNumber } = body;
    const name = (customerName || borrowerName || "").toString().trim().slice(0, 200);
    const eemail = (customerEmail || email || "").toString().trim().slice(0, 200);
    const phoneNum = (customerPhone || phone || "").toString().trim().slice(0, 15);
    const loanNum = (loanAccountNumber || loanNumber || "").toString().trim().slice(0, 50);
    const amountNum = Number(amount);

    if (!name || !eemail || !phoneNum || !amountNum || amountNum <= 0) {
      return makeResponse({ statusCode: 400, title: "Bad Request", message: "Missing or invalid required fields.", status: "error" });
    }

    if (amountNum > 10000000) {
      return makeResponse({ statusCode: 400, title: "Bad Request", message: "Amount exceeds maximum limit.", status: "error" });
    }

    const orderId = "MGM_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    await this.model.create({ orderId, customerName: name, customerEmail: eemail, customerPhone: phoneNum, amount: amountNum, paymentType, loanAccountNumber: loanNum });

    const { appId, secretKey, apiVersion, baseUrl } = this.getCashfreeConfig();
    const frontendBase = this.config.get<string>("frontendBase") || "https://mgmfinanciers.com";
    const webhookUrl = `${this.config.get<string>("apiBase") || "https://api.mgmfinanciers.com"}/payments/webhook`;

    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: (eemail || orderId).replace(/[^a-zA-Z0-9_-]/g, '_'),
        customer_name: name,
        customer_email: eemail,
        customer_phone: phoneNum,
      },
      order_meta: {
        return_url: `${frontendBase}/pay-emi?orderId=${orderId}`,
        webhook_url: webhookUrl,
      },
    };

    const response = await fetch(baseUrl + "/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": apiVersion,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (!response.ok) {
      this.logger.error(`Cashfree order creation failed: ${JSON.stringify(data)}`);
      return makeResponse({ statusCode: response.status || 500, title: "Order Failed", message: data.message || "Failed to create payment order", status: "error" });
    }

    return makeResponse({
      statusCode: 201, title: "Order Created", message: "Payment order created.", status: "success",
      data: { orderId: data.order_id, paymentSessionId: data.payment_session_id },
    });
  }

  async verifyPayment(orderId: string) {
    const payment = await this.model.findOne({ orderId });
    if (!payment) {
      return makeResponse({ statusCode: 404, title: "Not Found", message: "Payment not found.", status: "error" });
    }

    // If already terminal, return immediately
    if (["SUCCESS", "FAILED", "EXPIRED", "REFUNDED"].includes(payment.status)) {
      return makeResponse({
        statusCode: 200, title: "Payment Status", message: "Status retrieved.", status: "success",
        data: { status: payment.status, cfPaymentId: payment.cfPaymentId, paymentMethod: payment.paymentMethod, amount: payment.amount },
      });
    }

    const { appId, secretKey, apiVersion, baseUrl } = this.getCashfreeConfig();

    const response = await fetch(baseUrl + "/orders/" + orderId, {
      headers: { "x-client-id": appId, "x-client-secret": secretKey, "x-api-version": apiVersion },
    });

    const data: any = await response.json();
    this.logger.log(`Verify order ${orderId}: status=${data.order_status}, cf_order_id=${data.cf_order_id}`);

    this.applyCashfreeStatus(payment, data);

    return makeResponse({
      statusCode: 200, title: "Payment Status", message: "Status retrieved.", status: "success",
      data: { status: payment.status, cfPaymentId: payment.cfPaymentId, paymentMethod: payment.paymentMethod, amount: payment.amount },
    });
  }

  private applyCashfreeStatus(payment: PaymentDocument, data: any) {
    const orderStatus = data.order_status;

    if (orderStatus === "PAID") {
      payment.status = "SUCCESS";
      payment.cfPaymentId = data.cf_order_id ? String(data.cf_order_id) : "";
      payment.paymentMethod = data.payment_method || "";
      if (!payment.paidAt) payment.paidAt = new Date();
    } else if (orderStatus === "TERMINATED") {
      payment.status = "FAILED";
      payment.failureReason = data.error_description || "Payment terminated";
    } else if (orderStatus === "EXPIRED") {
      payment.status = "EXPIRED";
      payment.failureReason = "Payment session expired";
    } else if (orderStatus === "ACTIVE") {
      // Still pending
      payment.status = "PENDING";
    } else if (orderStatus === "PARTIAL") {
      payment.status = "PROCESSING";
    }

    payment.save().catch(err => this.logger.error(`Failed to save payment ${payment.orderId}: ${err.message}`));
  }

  async handleWebhook(body: any) {
    this.logger.log(`Webhook received for order: ${body?.order_id}, status: ${body?.order_status}`);

    const { order_id, order_status, cf_order_id, payment_method } = body;

    if (!order_id) {
      return makeResponse({ statusCode: 400, title: "Bad Request", message: "Missing order_id.", status: "error" });
    }

    const payment = await this.model.findOne({ orderId: order_id });
    if (!payment) {
      this.logger.warn(`Webhook for unknown order: ${order_id}`);
      return makeResponse({ statusCode: 404, title: "Not Found", message: "Payment not found.", status: "error" });
    }

    this.applyCashfreeStatus(payment, body);

    return makeResponse({
      statusCode: 200, title: "Webhook Processed", message: "Payment status updated.", status: "success",
      data: { status: payment.status },
    });
  }

  async trackByPhone(phone: string) {
    const payments = await this.model.find({ customerPhone: phone }).sort({ createdAt: -1 }).limit(10);
    if (!payments.length) {
      return makeResponse({ statusCode: 404, title: "Not Found", message: "No payments found for this phone number.", status: "error" });
    }
    return makeResponse({
      statusCode: 200, title: "Payments Found", message: "Payments retrieved successfully.", status: "success", data: payments,
    });
  }

  async findAll(search?: string, status?: string, page = 1, limit = 10) {
    const stages: PipelineStage[] = [];
    if (search) {
      const safeSearch = escapeRegex(search);
      stages.push({ $match: { $or: [
        { customerName: { $regex: safeSearch, $options: "i" } },
        { customerEmail: { $regex: safeSearch, $options: "i" } },
        { orderId: { $regex: safeSearch, $options: "i" } },
        { cfPaymentId: { $regex: safeSearch, $options: "i" } },
      ]}});
    }
    if (status && status !== "all") {
      stages.push({ $match: { status } });
    }
    const result = await paginate(this.model, {}, { page, limit, sort: { _id: -1 } }, stages);
    return makeResponse({ status: "success", message: "Data found", statusCode: 200, title: "Data Found", data: result });
  }

  async getStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, success, pending, processing, failed, expired, refunded, todayCountResult, revenueResult, todayRevenueResult, typeBreakdown] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: "SUCCESS" }),
      this.model.countDocuments({ status: "PENDING" }),
      this.model.countDocuments({ status: "PROCESSING" }),
      this.model.countDocuments({ status: "FAILED" }),
      this.model.countDocuments({ status: "EXPIRED" }),
      this.model.countDocuments({ status: "REFUNDED" }),
      this.model.countDocuments({ createdAt: { $gte: todayStart } }),
      this.model.aggregate([
        { $match: { status: "SUCCESS" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      this.model.aggregate([
        { $match: { status: "SUCCESS", createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      this.model.aggregate([
        { $group: { _id: "$paymentType", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return makeResponse({
      statusCode: 200, title: "Stats", message: "Stats retrieved.", status: "success",
      data: {
        total,
        success,
        pending,
        processing,
        failed,
        expired,
        refunded,
        todayCount: todayCountResult,
        totalRevenue: revenueResult[0]?.total || 0,
        todayRevenue: todayRevenueResult[0]?.total || 0,
        successRate: total ? Math.round((success / total) * 100) : 0,
        typeBreakdown: typeBreakdown,
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async autoVerifyPendingPayments() {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
    const pendingPayments = await this.model.find({
      status: "PENDING",
      createdAt: { $lte: cutoff },
    }).limit(20).exec();

    if (!pendingPayments.length) return;

    this.logger.log(`Auto-verifying ${pendingPayments.length} pending payments...`);
    const { appId, secretKey, apiVersion, baseUrl } = this.getCashfreeConfig();

    for (const payment of pendingPayments) {
      try {
        const response = await fetch(baseUrl + "/orders/" + payment.orderId, {
          headers: { "x-client-id": appId, "x-client-secret": secretKey, "x-api-version": apiVersion },
        });
        const data: any = await response.json();
        this.applyCashfreeStatus(payment, data);
      } catch (err: any) {
        this.logger.error(`Auto-verify failed for ${payment.orderId}: ${err.message}`);
      }
    }
  }
}
