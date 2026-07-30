import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  })
  email!: string;

  @Prop({ required: true, minlength: 8, select: false })
  password!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: [String], enum: Object.values(Role), default: [Role.USER] })
  roles!: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error: unknown) {
    if (error instanceof Error) next(error);
    else next(new Error('Unknown error during password hashing'));
  }
});
