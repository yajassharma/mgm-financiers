// src/common/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendResetEmail(to: string, link: string) {
    await this.transporter.sendMail({
      from: `"Go DriveX" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${link}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
}
