import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  _id!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  })
  email!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  })
  username!: string;

  @Prop({ required: true, minlength: 6, select: false })
  password!: string;

  @Prop({ default: ['admin'] })
  roles!: string[];

  @Prop({ trim: true, maxlength: 50 })
  firstName?: string;

  @Prop({ trim: true, maxlength: 50 })
  lastName?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Date, default: Date })
  lastLogin?: Date;

  @Prop({ type: String, default: null })
  resetPasswordToken?: string | null;

  @Prop({ type: Date, default: null })
  resetPasswordExpires?: Date | null;

  @Prop({ type: Number, default: 0 })
  totalConsents?: number;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre<AdminDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
