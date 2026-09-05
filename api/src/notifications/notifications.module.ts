import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationLog, NotificationLogSchema } from './schema/notification-log.schema';
import { EmailNotificationService } from './email-notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
    ]),
  ],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class NotificationsModule {}
