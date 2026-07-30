import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GrievanceDocument = Grievance & Document;

const generateGrievanceId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `GM-${num}`;
};

@Schema({ timestamps: true })
export class Grievance {
  @Prop({ required: true, trim: true, default: generateGrievanceId, unique: true })
  grievanceId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  mobile!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, trim: true })
  subject!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ trim: true, default: '' })
  address!: string;

  @Prop({ enum: ['RECEIVED', 'IN_REVIEW', 'PENDING_CUSTOMER', 'RESOLVED', 'CLOSED'], default: 'RECEIVED' })
  status!: string;

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' })
  priority!: string;

  @Prop({ trim: true, default: '' })
  adminResponse!: string;

  @Prop({ trim: true, default: '' })
  customerUpdate!: string;

  @Prop({ trim: true, default: '' })
  internalNotes!: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  assignedTo!: Types.ObjectId;

  @Prop({ type: [{ timestamp: Date, status: String, note: String }], default: [] })
  statusHistory!: { timestamp: Date; status: string; note: string }[];
}

export const GrievanceSchema = SchemaFactory.createForClass(Grievance);
