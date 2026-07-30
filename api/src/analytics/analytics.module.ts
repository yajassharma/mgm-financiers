import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Grievance, GrievanceSchema } from '../grievances/schema/grievances.schema';
import { Payment, PaymentSchema } from '../payments/schema/payments.schema';
import { Consent, ConsentSchema } from '../consents/schema/consents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grievance.name, schema: GrievanceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Consent.name, schema: ConsentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
