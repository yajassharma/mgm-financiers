import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ trim: true, default: '' }) link!: string;
  @Prop({ required: true }) otp!: string;
  @Prop({ required: true }) consentId!: string;
  @Prop({ trim: true, default: '' }) phoneNumber!: string;
  @Prop({ trim: true, default: '' }) email!: string;
  @Prop({ required: true }) expiresAt!: Date;
  @Prop({ default: false }) isUsed!: boolean;
  @Prop({ default: 0 }) attempts!: number;
  @Prop({ trim: true, default: 'consent' }) purpose!: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
