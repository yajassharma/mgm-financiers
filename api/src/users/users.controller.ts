import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserJwtGuard } from '../common/guards/user-jwt.guard';

@Controller('user')
@UseGuards(UserJwtGuard)
export class UsersController {
  @Get('profile')
  profile(@Req() req: any) {
    return {
      title: 'User Profile',
      message: 'Profile fetched',
      data: req.user,
    };
  }
}
