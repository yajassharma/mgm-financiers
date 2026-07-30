import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

const generateLeadId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `LD-${num}`;
};

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true, trim: true, default: generateLeadId, unique: true })
  leadId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ trim: true, default: '' })
  email!: string;

  @Prop({ required: true, trim: true })
  loanType!: string;

  @Prop({ required: true, type: Number })
  amount!: number;

  @Prop({ trim: true, default: '' })
  cibil!: string;

  @Prop({ trim: true, default: '' })
  employment!: string;

  @Prop({ trim: true, default: '' })
  purpose!: string;

  @Prop({ enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST'], default: 'NEW' })
  status!: string;

  @Prop({ trim: true, default: '' })
  source!: string;

  @Prop({ trim: true, default: '' })
  notes!: string;

  @Prop({ type: [{ timestamp: Date, status: String, note: String }], default: [] })
  statusHistory!: { timestamp: Date; status: string; note: string }[];

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  assignedTo!: Types.ObjectId;

  @Prop({ trim: true, default: '' })
  loanAccountNumber!: string;

  @Prop({ type: Date })
  contactedAt!: Date;

  @Prop({ type: Date })
  convertedAt!: Date;

  @Prop({ type: Date })
  lostAt!: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
