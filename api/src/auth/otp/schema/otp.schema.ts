import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true }) link!: string;
  @Prop({ required: true }) otp!: string;
  @Prop({ required: true }) consentId!: string;
  @Prop({ required: true }) expiresAt!: Date;
  @Prop({ default: false }) isUsed!: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
