import { Module } from '@nestjs/common';
import { ConsentsService } from './consents.service';
import { ConsentsController } from './consents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Consent, ConsentSchema } from './schema/consents.schema';
import { OtpService } from 'src/auth/otp/otp.service';
import { Otp, OtpSchema } from 'src/auth/otp/schema/otp.schema';
import { ConsentExpiryCron } from './consent-expiry.cron';
import { Admin, AdminSchema } from 'src/admin/schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consent.name, schema: ConsentSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [ConsentsController],
  providers: [ConsentsService, OtpService, ConsentExpiryCron],
})
export class ConsentsModule {}
