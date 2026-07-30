import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsentDocument = Consent & Document;

const PREFIXES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateConsentId = () => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];

  const number = Math.floor(1000 + Math.random() * 9000);

  return `MGM-${prefix}${number}`;
};

@Schema({ timestamps: true })
export class Consent {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    required: true,
    trim: true,
    default: generateConsentId,
    unique: true,
  })
  consentId!: string;

  @Prop({ required: true, trim: true })
  mobile!: string;

  @Prop({ required: true, trim: true })
  pan!: string;

  @Prop({ required: true, trim: true })
  loanPurpose!: string;

  @Prop({ required: true, default: Date })
  consentedDate!: Date;

  @Prop({ required: true, default: Date })
  consentedCaptureTime!: Date;

  @Prop({
    enum: ['SENT', 'OTP_VERIFIED', 'CONSENTED', 'EXPIRED'],
    default: 'SENT',
  })
  status!: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  consentBy!: Types.ObjectId;
}

export const ConsentSchema = SchemaFactory.createForClass(Consent);
