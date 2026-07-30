import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Role } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async createUser(input: {
    email: string;
    password: string;
    name: string;
    roles?: Role[];
  }) {
    const user = new this.model({
      ...input,
      roles: input.roles ?? [Role.USER],
    });
    return user.save();
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }
  async findByEmailWithPassword(email: string) {
    return this.model.findOne({ email }).select('+password').exec();
  }
  async validateUser(email: string, password: string) {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
  async findById(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }
  async list() {
    return this.model.find().lean().exec();
  }
}
