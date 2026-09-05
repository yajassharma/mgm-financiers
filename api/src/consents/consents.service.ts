import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Consent, ConsentDocument } from './schema/consents.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { makeResponse } from 'src/common/helpers/response.helper';
import { paginate } from 'src/common/helpers/pagination.helper';
import { escapeRegex } from 'src/common/helpers/regex.helper';
import { OtpService } from 'src/auth/otp/otp.service';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schema';

@Injectable()
export class ConsentsService {
  constructor(
    @InjectModel(Consent.name) readonly model: Model<ConsentDocument>,
    private readonly otp: OtpService,
    @InjectModel(Admin.name) readonly adminModel: Model<AdminDocument>,
  ) {}

  async sentConsentLink(body: any, userId: string) {
    const { name, mobile, pan, loanPurpose } = body;

    const normalizedPan = pan?.toUpperCase();

    // 🔁 Duplicate check (mobile OR pan)
    const existingConsent = await this.model.findOne({
      $or: [{ mobile }, { pan: normalizedPan }],
    });

    if (existingConsent) {
      return makeResponse({
        statusCode: 409,
        title: 'Duplicate Request',
        message:
          'A consent request already exists for this mobile number or PAN.',
        status: 'error',
      });
    }

    const inserted = await this.model.create({
      name,
      mobile,
      pan: pan.toUpperCase(),
      loanPurpose,
      consentBy: new Types.ObjectId(userId),
    });

    if (inserted) {
      await this.adminModel.updateOne(
        { _id: userId },
        {
          $inc: {
            totalConsents: 1,
          },
        },
      );
      await this.otp.sendOtp(inserted.mobile, inserted.consentId);
      return makeResponse({
        statusCode: 201,
        title: 'Consent Link Sent',
        message:
          'Consent link has been successfully sent to the registered mobile number.',
        status: 'success',
      });
    }

    return makeResponse({
      statusCode: 400,
      title: 'Consent Request Failed',
      message:
        'Unable to process the consent request. Please verify the provided details and try again.',
      status: 'error',
    });
  }

  async resentConsentLink(body: any) {
    const { _id } = body;

    if (!_id) {
      return makeResponse({
        statusCode: 400,
        title: 'Invalid Request',
        message: 'Consent ID is required.',
        status: 'error',
      });
    }

    // 🔍 Find existing consent
    const consent = await this.model.findOne({ _id: _id });

    if (!consent) {
      return makeResponse({
        statusCode: 400,
        title: 'Consent Not Found',
        message: 'No consent request found for the given consent ID.',
        status: 'error',
      });
    }

    // 🔁 Reset status & timestamps
    consent.status = 'SENT';
    consent.consentedDate = new Date();

    await consent.save();

    // 📲 Send same consent link / OTP
    await this.otp.sendOtp(consent.mobile, consent.consentId);

    return makeResponse({
      statusCode: 200,
      title: 'Consent Link Resent',
      message:
        'Consent link has been resent successfully to the registered mobile number.',
      status: 'success',
    });
  }

  async allConsents(
    search?: string,
    status?: string,
    page = 1,
    limit = 10,
    role?: string,
    maxLimit?: number,
  ) {
    const stages: PipelineStage[] = [];

    if (search) {
      const safeSearch = escapeRegex(search);
      stages.push({
        $match: {
          $or: [
            { mobile: { $regex: safeSearch, $options: 'i' } },
            { name: { $regex: safeSearch, $options: 'i' } },
            { pan: { $regex: safeSearch, $options: 'i' } },
            { consentId: { $regex: safeSearch, $options: 'i' } },
          ],
        },
      });
    }

    if (status && status !== 'all') {
      stages.push({
        $match: {
          status: status,
        },
      });
    }

    if (role && role === 'executer') {
      stages.push({
        $project: {
          pan: 0,
        },
      });
    }
    const result = await paginate(
      this.model,
      {},
      {
        page,
        limit,
        maxLimit,
        sort: { _id: -1 },
      },
      stages,
    );

    return makeResponse({
      status: 'success',
      message: 'Data found',
      statusCode: 200,
      title: 'Data Found',
      data: result,
    });
  }

  async verifyConsentLink(consentId: string) {
    const consent = await this.model.findOne({ consentId }).sort({ _id: -1 });

    if (!consent) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid Link',
        message: 'The consent link is invalid or does not exist.',
        data: {
          route: 'error',
          title: 'Invalid Link',
          message:
            'This consent request is no longer valid or has already been used.',
        },
      });
    }

    if (consent.status === 'CONSENTED') {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Already Consented',
        message: 'This consent request has already been completed.',
        data: {
          route: 'success',
          title: 'Already Consented',
          message: 'This consent request has already been completed.',
          consentId: consent.consentId,
        },
      });
    }

    if (consent.status === 'EXPIRED') {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Link Expired',
        message: 'This consent link has expired.',
        data: {
          route: 'error',
          title: 'Link Expired',
          message: 'This consent link has expired.',
          consentId: consent.consentId,
        },
      });
    }

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'Consent Valid',
      message: 'Consent link verified successfully.',
      data: {
        route: 'allow',
        consentId: consent.consentId,
        name: consent.name,
        loanPurpose: consent.loanPurpose,
        mobile: consent.mobile,
        status: consent.status,
      },
    });
  }

  async verifyOtp(consentId: string, otp: string) {
    const result = await this.otp.verifyOtp(consentId, otp);

    if (result.status === 'error') {
      return result;
    }
    const consent = await this.model.findOne({ consentId });

    if (!consent) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Consent Not Found',
        message: 'Associated consent request not found.',
      });
    }

    // 🔁 Update consent state
    consent.status = 'OTP_VERIFIED';
    await consent.save();

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'OTP Verified',
      message: 'OTP verified successfully.',
    });
  }

  async approveConsent(consentId: string) {
    const consent = await this.model.findOne({ consentId });

    if (!consent) {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Consent Not Found',
        message: 'Consent request not found.',
      });
    }

    if (consent.status !== 'OTP_VERIFIED') {
      return makeResponse({
        statusCode: 400,
        status: 'error',
        title: 'Invalid State',
        message: 'OTP verification is required before consenting.',
      });
    }

    consent.status = 'CONSENTED';
    consent.consentedCaptureTime = new Date();
    await consent.save();

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'Consent Granted',
      message: 'Consent has been successfully recorded.',
    });
  }
}
