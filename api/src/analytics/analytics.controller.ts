import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(AdminJwtGuard, RolesGuard)
@Roles('admin', 'superadmin')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.service.getOverview();
  }

  @Get('traffic')
  getTraffic(@Query('period') period?: string) {
    return this.service.getTraffic(period);
  }

  @Get('page-views')
  getPageViews() {
    return this.service.getPageViews();
  }

  @Get('realtime')
  getRealtime() {
    return this.service.getRealtime();
  }
}
