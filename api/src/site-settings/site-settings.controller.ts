import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  @UseGuards(AdminJwtGuard)
  update(@Body() body: any) {
    return this.service.update(body);
  }
}
