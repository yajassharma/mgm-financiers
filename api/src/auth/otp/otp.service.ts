import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';
import { makeResponse } from 'src/common/helpers/response.helper';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly MAX_OTP_ATTEMPTS = 5;

  constructor(@InjectModel(Otp.name) readonly model: Model<OtpDocument>) {}

  private async sendOtpSms(mobile: string, otp: string, consentId: string) {
    const res = await axios({
      url: 'https://www.fast2sms.com/dev/bulkV2',
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
      },

      method: 'POST',
      data: {
        route: 'dlt',
        sender_id: 'MGMFIN',
        message: '207937',
        variables_values: `${process.env.CONSENT_URL + consentId}|${otp}|`,
        flash: 0,
        numbers: mobile,
      },
    });

    this.logger.log(`OTP SMS status: ${res.data.status}`);
  }

  generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOtp(phoneNumber: string, consentId: string) {
    const otp = this.generateOtp();

    await this.model.create({
      phoneNumber,
      consentId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      link: `${process.env.CONSENT_URL + consentId}`,
    });

    await this.sendOtpSms(phoneNumber, otp, consentId);

    return makeResponse({
      status: 'success',
      statusCode: 200,
      title: 'OTP Sent',
      message: 'OTP successfully sent',
    });
  }

  async verifyOtp(consentId: string, otp: string) {
    const doc = await this.model
      .findOne({ consentId, otp })
      .sort({ createdAt: -1 });

    if (!doc)
      return makeResponse({
        status: 'error',
        statusCode: 400,
        title: 'Invalid OTP',
        message: 'OTP not found',
      });

    if (doc.expiresAt < new Date())
      return makeResponse({
        status: 'error',
        statusCode: 400,
        title: 'OTP Expired',
        message: 'Please request a new OTP',
      });

    if (doc.attempts >= this.MAX_OTP_ATTEMPTS) {
      return makeResponse({
        status: 'error',
        statusCode: 429,
        title: 'Too Many Attempts',
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.',
      });
    }

    if (doc.otp !== otp) {
      doc.attempts = (doc.attempts || 0) + 1;
      await doc.save();

      return makeResponse({
        status: 'error',
        statusCode: 400,
        title: 'Incorrect OTP',
        message: 'OTP does not match',
      });
    }

    doc.isUsed = true;
    await doc.save();

    return makeResponse({
      status: 'success',
      statusCode: 200,
      title: 'OTP Verified',
      message: 'OTP verification successful',
    });
  }

  async hasRecentUsedResetOtp(phoneNumber: string) {
    const since = new Date(Date.now() - 10 * 60 * 1000);

    return !!(await this.model.findOne({
      phoneNumber,
      isUsed: true,
      updatedAt: { $gte: since },
    }));
  }

  private async createOtpDoc(phoneNumber: string, purpose: string) {
    const otp = this.generateOtp();
    const ref = `${purpose}-${Date.now()}-${crypto.randomInt(1000, 9999)}`;

    await this.model.create({
      phoneNumber,
      consentId: ref,
      purpose,
      link: '',
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return otp;
  }

  async sendGrievanceOtp(phone: string) {
    const trimmed = (phone || '').toString().trim();
    if (!/^[6-9]\d{9}$/.test(trimmed)) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid Phone',
        message: 'Enter a valid 10-digit Indian mobile number.',
      });
    }

    // Per-phone cooldown: 1 OTP per 60 seconds
    const lastOtp = await this.model.findOne({ phoneNumber: trimmed, purpose: 'grievance' }).sort({ createdAt: -1 });
    if (lastOtp && Date.now() - new Date((lastOtp as any).createdAt).getTime() < 60 * 1000) {
      return makeResponse({
        statusCode: 429,
        status: 'error',
        title: 'Please Wait',
        message: 'Please wait at least 1 minute before requesting another OTP.',
      });
    }

    // Per-phone daily cap: 5 OTPs per 24h
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await this.model.countDocuments({ phoneNumber: trimmed, purpose: 'grievance', createdAt: { $gte: dayAgo } });
    if (recentCount >= 5) {
      return makeResponse({
        statusCode: 429,
        status: 'error',
        title: 'Limit Reached',
        message: 'Too many OTP requests. Please try again later.',
      });
    }

    const otp = await this.createOtpDoc(trimmed, 'grievance');

    try {
      await this.sendGrievanceOtpSms(trimmed, otp);
    } catch (err: any) {
      this.logger.error(`Grievance OTP SMS failed for ${trimmed}: ${err.message}`);
      return makeResponse({
        statusCode: 502,
        status: 'error',
        title: 'SMS Failed',
        message: 'Could not send OTP right now. Please try again shortly.',
      });
    }

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'OTP Sent',
      message: 'OTP has been sent to your mobile number.',
    });
  }

  private async sendGrievanceOtpSms(phone: string, otp: string) {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      // Local dev fallback — never call the SMS API without a key
      this.logger.warn(`FAST2SMS_API_KEY not set — DEV OTP for ${phone}: ${otp}`);
      return;
    }

    const res = await axios({
      url: 'https://www.fast2sms.com/dev/bulkV2',
      headers: { authorization: apiKey },
      method: 'POST',
      data: {
        route: 'dlt',
        sender_id: 'MGMFIN',
        message: '230367',
        variables_values: otp,
        flash: 0,
        numbers: phone,
      },
    });

    this.logger.log(`Grievance OTP SMS status: ${res.data?.status}`);
  }

  // Read-only check — used by frontend to show "verified" feedback. Does NOT consume the OTP.
  async checkGrievanceOtp(phone: string, otp: string) {
    const trimmed = (phone || '').toString().trim();
    const body = (otp || '').toString().trim();
    if (!/^[6-9]\d{9}$/.test(trimmed) || !/^\d{6}$/.test(body)) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid OTP',
        message: 'Enter a valid 6-digit OTP.',
      });
    }

    const doc = await this.model
      .findOne({ phoneNumber: trimmed, purpose: 'grievance', otp: body, isUsed: false })
      .sort({ createdAt: -1 });

    if (!doc) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid OTP',
        message: 'OTP not found or already used.',
      });
    }
    if ((doc as any).expiresAt < new Date()) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'OTP Expired',
        message: 'Please request a new OTP.',
      });
    }

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'OTP Verified',
      message: 'OTP verified successfully.',
    });
  }

  // Atomic consume — used at grievance creation time. OTP is single-use.
  async consumeGrievanceOtp(phone: string, otp: string) {
    const trimmed = (phone || '').toString().trim();
    const body = (otp || '').toString().trim();

    const doc = await this.model
      .findOneAndUpdate(
        {
          phoneNumber: trimmed,
          purpose: 'grievance',
          otp: body,
          isUsed: false,
          expiresAt: { $gt: new Date() },
          attempts: { $lt: this.MAX_OTP_ATTEMPTS },
        },
        { $set: { isUsed: true } },
        { sort: { createdAt: -1 }, new: true },
      );

    if (!doc) {
      // Count as a failed attempt on the latest matching-purpose docs to enable lockout
      const latest = await this.model.findOne({ phoneNumber: trimmed, purpose: 'grievance', isUsed: false }).sort({ createdAt: -1 });
      if (latest) {
        (latest as any).attempts = ((latest as any).attempts || 0) + 1;
        await latest.save();
      }
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid OTP',
        message: 'OTP is invalid, expired, or already used.',
      });
    }

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'OTP Verified',
      message: 'OTP verified successfully.',
    });
  }
}
