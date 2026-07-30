import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Consent, ConsentDocument } from './schema/consents.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConsentExpiryCron {
  private readonly logger = new Logger(ConsentExpiryCron.name);

  constructor(
    @InjectModel(Consent.name)
    private readonly consentModel: Model<ConsentDocument>,
  ) {}

  // ⏱ Runs every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async expireOldConsents() {
    const expiryTime = new Date(Date.now() - 10 * 60 * 1000);

    const result = await this.consentModel.updateMany(
      {
        status: 'SENT',
        consentedDate: { $lt: expiryTime },
      },
      {
        $set: { status: 'EXPIRED' },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(
        `Expired ${result.modifiedCount} consent(s) older than 15 minutes`,
      );
    }
  }
}
