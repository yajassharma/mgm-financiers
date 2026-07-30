import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post()
  create(@Body() body: any) { return this.service.createLead(body); }

  @Get()
  @UseGuards(AdminJwtGuard)
  findAll(@Query('search') search: string, @Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(search, status, +page, +limit);
  }

  @Get('stats')
  @UseGuards(AdminJwtGuard)
  getStats() { return this.service.getStats(); }

  @Get(':id')
  @UseGuards(AdminJwtGuard)
  findById(@Param('id') id: string) { return this.service.findById(id); }

  @Patch(':id/status')
  @UseGuards(AdminJwtGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status?: string; notes?: string }) {
    return this.service.updateStatus(id, body);
  }
}
