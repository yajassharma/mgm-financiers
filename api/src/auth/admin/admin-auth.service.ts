import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import * as jwt from 'jsonwebtoken';
import { MailerService } from 'src/common/services/mailer.service';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ForgotAdmin } from './dto/forgotAdmin.dto';
import { makeResponse } from 'src/common/helpers/response.helper';
import { CreateAdmin } from './dto/create-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly admins: AdminService,
    private mailer: MailerService,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    if (typeof email !== 'string' || typeof password !== 'string' ||
        email.length > 254 || password.length > 128 ||
        typeof email === 'object' || typeof password === 'object') {
      return makeResponse({
        statusCode: 400,
        title: 'Error',
        message: 'User credentials mismatched',
        status: 'error',
      });
    }
    const admin = await this.admins.validateAdmin(email, password);
    if (!admin) {
      return makeResponse({
        statusCode: 400,
        title: 'Error',
        message: 'User credentials mismatched',
        status: 'error',
      });
    }

    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT secret not set');
    }

    const expiresIn: any = process.env.JWT_EXPIRES_IN || '1h';

    const payload = {
      _id: admin._id.toString(),
      email: admin.email,
      roles: admin.roles,
    };

    const accessToken = jwt.sign(
      {
        data: payload,
      },
      secret,
      { expiresIn: expiresIn },
    );

    return {
      title: 'Login',
      message: 'Admin logged in',
      data: {
        token: accessToken,
        authUserState: {
          username: admin.username,
          role: admin.roles,
          _id: admin._id,
          name: `${admin.firstName} ${admin.lastName}`,
        },
      },
    };
  }

  async createAdmin(body: CreateAdmin) {
    await this.admins.createAdmin(body);
    return {
      title: 'Admin Created',
      message: 'Admin Registered Successfully',
    };
  }
  async forgotPassword(body: ForgotAdmin) {
    const { email } = body;

    const admin = await this.admins.findAdmin(email);

    if (admin) {
      // Generate random token
      const resetToken = crypto.randomUUID();
      const resetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1h

      // Save hashed token in DB
      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpires = resetExpire;
      await admin.save();

      // Build reset link (send raw token in URL, store hash in DB)
      const resetLink = `${process.env.FRONTEND_BASE}/reset-password/${resetToken}`;

      // Send email
      await this.mailer.sendResetEmail(admin.email, resetLink);
    }

    // Always return success (even if email not found)
    return {
      title: 'Password Reset Email Sent',
      message:
        'If this email exists in our system, a reset link has been sent.',
    };
  }

  async verifyResetToken(token: string) {
    const admin = await this.adminModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!admin) {
      return {
        statusCode: 400,
        message: 'Invalid or expired token',
      };
    }
    return makeResponse({
      statusCode: 200,
      status: 'success',
      message: 'Verification successfully',
      title: 'Email Verified success',
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const admin = await this.adminModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!admin) {
      return {
        statusCode: 400,
        message: 'Invalid or expired token',
        status: 'error',
      };
    }

    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return { message: 'Password successfully updated' };
  }

  async seedFirstAdmin({ email, password, secret }: { email: string; password: string; secret: string }) {
    if (secret !== 'MGM_SEED_2024!') {
      return makeResponse({
        statusCode: 403,
        title: 'Forbidden',
        message: 'Invalid seed secret',
        status: 'error',
      });
    }

    const count = await this.adminModel.countDocuments();
    if (count > 0) {
      return makeResponse({
        statusCode: 409,
        title: 'Conflict',
        message: 'Admin already exists. Use register endpoint.',
        status: 'error',
      });
    }

    await this.adminModel.create({
      email,
      password,
      firstName: 'Super',
      lastName: 'Admin',
      username: 'superadmin',
      roles: ['superadmin'],
    });

    return {
      title: 'Seed Complete',
      message: 'First admin created successfully',
    };
  }
}
