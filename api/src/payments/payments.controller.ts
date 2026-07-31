import { Body, Controller, Get, Param, Post, Query, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() body: any) { return this.service.createOrder(body); }

  @Get('verify/:orderId')
  verify(@Param('orderId') orderId: string) { return this.service.verifyPayment(orderId); }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>, @Body() body: any) {
    return this.service.handleWebhook(body);
  }

  @Get('track/:phone')
  trackByPhone(@Param('phone') phone: string) { return this.service.trackByPhone(phone); }

  @Get()
  @UseGuards(AdminJwtGuard)
  findAll(@Query('search') search: string, @Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(search, status, +page, +limit);
  }

  @Get('stats')
  @UseGuards(AdminJwtGuard)
  getStats() { return this.service.getStats(); }
}
