import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly service: GrievancesService) {}

  @Post()
  create(@Body() body: any) { return this.service.createGrievance(body); }

  @Post('send-otp')
  sendOtp(@Body() body: { phone: string }) { return this.service.sendGrievanceOtp(body?.phone); }

  @Post('verify-otp')
  verifyOtp(@Body() body: { phone: string; otp: string }) {
    return this.service.checkGrievanceOtp(body?.phone, body?.otp);
  }

  @Post(':grievanceId/follow-up')
  addFollowUp(@Param('grievanceId') grievanceId: string, @Body() body: { name: string; email: string; message: string }) {
    return this.service.addFollowUp(grievanceId, body);
  }

  @Post('track/send-otp')
  sendTrackOtp(@Body() body: { email: string }) { return this.service.sendTrackOtp(body?.email); }

  @Post('track/verify')
  verifyTrackOtp(@Body() body: { email: string; otp: string }) { return this.service.verifyTrackOtp(body); }

  @Post('track/:grievanceId/fetch')
  fetchTrackOtp(@Param('grievanceId') grievanceId: string, @Body() body: { email: string; otp: string }) {
    return this.service.fetchTrackOtp(grievanceId, body);
  }

  @Get()
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findAll(@Query('search') search: string, @Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(search, status, +page, +limit);
  }

  @Get('stats')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  getStats() { return this.service.getStats(); }

  @Delete(':id/follow-ups')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('superadmin')
  removeFollowUp(@Param('id') id: string, @Body() body: { timestamp: string }) {
    return this.service.removeFollowUp(id, body?.timestamp);
  }

  @Patch(':id/status')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('superadmin')
  updateStatus(@Param('id') id: string, @Body() body: { status?: string; adminResponse?: string; customerUpdate?: string; internalNotes?: string }) {
    return this.service.updateStatus(id, body);
  }
}
