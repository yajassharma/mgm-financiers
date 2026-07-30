import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, trim: true, unique: true })
  orderId!: string;

  @Prop({ trim: true })
  cfPaymentId!: string;

  @Prop({ required: true, trim: true })
  customerName!: string;

  @Prop({ required: true, trim: true })
  customerEmail!: string;

  @Prop({ required: true, trim: true })
  customerPhone!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ trim: true })
  paymentType!: string;

  @Prop({ trim: true })
  loanAccountNumber!: string;

  @Prop({ enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED', 'REFUNDED'], default: 'PENDING' })
  status!: string;

  @Prop({ trim: true, default: '' })
  paymentMethod!: string;

  @Prop({ trim: true, default: '' })
  failureReason!: string;

  @Prop({ type: Date })
  paidAt!: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
