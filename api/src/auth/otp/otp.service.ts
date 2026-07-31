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
}
