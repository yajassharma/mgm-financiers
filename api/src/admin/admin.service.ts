import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdmin } from 'src/auth/admin/dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private model: Model<AdminDocument>) {}

  async createAdmin(data: CreateAdmin) {
    const admin = new this.model({ ...data, roles: ['admin'] });
    return admin.save();
  }

  async findByEmailWithPassword(email: string) {
    return this.model.findOne({ email }).select('+password').exec();
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.findByEmailWithPassword(email);
    if (!admin) return null;
    const ok = await bcrypt.compare(password, admin.password);
    return ok ? admin : null;
  }
  async findAdmin(email: string) {
    return this.model.findOne({ email });
  }

  async findById(_id: string) {
    return this.model.findOne({ _id });
  }
}
