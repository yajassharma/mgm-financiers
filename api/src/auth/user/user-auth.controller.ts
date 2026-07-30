import { Controller, Post, Body } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';

@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly auth: UserAuthService) {}
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }
}
