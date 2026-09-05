import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schema/leads.schema';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    NotificationsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
