import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly service: GrievancesService) {}

  @Post()
  create(@Body() body: any) { return this.service.createGrievance(body); }

  @Post(':grievanceId/follow-up')
  addFollowUp(@Param('grievanceId') grievanceId: string, @Body() body: { name: string; email: string; message: string }) {
    return this.service.addFollowUp(grievanceId, body);
  }

  @Post('track-by-email')
  trackByEmail(@Body() body: { email: string }) { return this.service.trackByEmail(body); }

  @Get('track/:grievanceId')
  trackById(@Param('grievanceId') id: string) { return this.service.trackById(id); }

  @Get()
  @UseGuards(AdminJwtGuard)
  findAll(@Query('search') search: string, @Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(search, status, +page, +limit);
  }

  @Get('stats')
  @UseGuards(AdminJwtGuard)
  getStats() { return this.service.getStats(); }

  @Patch(':id/status')
  @UseGuards(AdminJwtGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status?: string; adminResponse?: string; customerUpdate?: string; internalNotes?: string }) {
    return this.service.updateStatus(id, body);
  }
}
