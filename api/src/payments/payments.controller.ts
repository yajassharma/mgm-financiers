import { Body, Controller, Get, Param, Post, Query, RawBodyRequest, Req, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() body: any) { return this.service.createOrder(body); }

  @Get('verify/:orderId')
  verify(@Param('orderId') orderId: string) { return this.service.verifyPayment(orderId); }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>, @Body() body: any, @Headers('x-cf-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body for signature verification');
    }
    return this.service.handleWebhook(body, rawBody, signature);
  }

  @Get('track/:phone')
  trackByPhone(@Param('phone') phone: string) { return this.service.trackByPhone(phone); }

  @Get()
  @UseGuards(AdminJwtGuard)
  @Roles('admin', 'superadmin')
  findAll(@Query('search') search: string, @Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(search, status, +page, +limit);
  }

  @Get('stats')
  @UseGuards(AdminJwtGuard)
  @Roles('admin', 'superadmin')
  getStats() { return this.service.getStats(); }
}
