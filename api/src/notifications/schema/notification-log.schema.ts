import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationLogDocument = NotificationLog & Document;

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ required: true, enum: ['PAYMENT_SUCCESS', 'GRIEVANCE_NEW', 'GRIEVANCE_UPDATE', 'LEAD_NEW'] })
  notificationType!: string;

  @Prop({ required: true })
  recipientEmail!: string;

  @Prop({ required: true })
  relatedId!: string;

  @Prop({ required: true, enum: ['pending', 'sent', 'failed', 'skipped'] })
  status!: string;

  @Prop()
  providerMessageId?: string;

  @Prop()
  failureReason?: string;

  @Prop()
  subject?: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
NotificationLogSchema.index({ notificationType: 1, relatedId: 1 }, { unique: true });
NotificationLogSchema.index({ createdAt: -1 });
