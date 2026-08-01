import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { CreateAdmin } from './dto/create-admin.dto';
import { ForgotAdmin } from './dto/forgotAdmin.dto';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @Post('register')
  @UseGuards(AdminJwtGuard)
  register(@Body() body: CreateAdmin) {
    return this.auth.createAdmin(body);
  }

  @Post('seed-first')
  seedFirst(@Body() body: { email: string; password: string; secret: string }) {
    return this.auth.seedFirstAdmin(body);
  }

  @Post('forgot-user')
  forgotUser(@Body() body: ForgotAdmin) {
    return this.auth.forgotPassword(body);
  }

  @Post('verify/:token')
  verifyReset(@Param('token') token: string) {
    return this.auth.verifyResetToken(token);
  }

  @Post('reset')
  resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.auth.resetPassword(token, password);
  }
}
