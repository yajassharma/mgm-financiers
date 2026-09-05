import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminJwtGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}
  @Get('profile')
  @Roles('admin', 'superadmin')
  async profile(@Req() req: any) {
    const admin = await this.admin.findById(req.user._id);

    return {
      title: 'Admin Profile',
      message: 'Profile fetched',
      data: admin,
    };
  }
}
