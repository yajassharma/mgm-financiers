import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Grievance, GrievanceSchema } from './schema/grievances.schema';
import { GrievancesService } from './grievances.service';
import { GrievancesController } from './grievances.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { OtpService } from 'src/auth/otp/otp.service';
import { Otp, OtpSchema } from 'src/auth/otp/schema/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grievance.name, schema: GrievanceSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [GrievancesController],
  providers: [GrievancesService, OtpService],
})
export class GrievancesModule {}
