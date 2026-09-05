import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminJwtGuard } from './common/guards/admin-jwt.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel('Grievance') private readonly grievanceModel: Model<any>,
    @InjectModel('Lead') private readonly leadModel: Model<any>,
    @InjectModel('Payment') private readonly paymentModel: Model<any>,
    @InjectModel('NotificationLog') private readonly logModel: Model<any>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('admin/cleanup-test-data')
  @UseGuards(AdminJwtGuard)
  async cleanupTestData() {
    const results: Record<string, number> = {};

    const g = await this.grievanceModel.deleteOne({ grievanceId: 'GM-369737' });
    results.grievances = g.deletedCount;

    const l = await this.leadModel.deleteOne({ leadId: 'LD-719374' });
    results.leads = l.deletedCount;

    const p = await this.paymentModel.deleteMany({
      orderId: { $in: [
        'MGM_1788580016277_z0vd201ra',
        'MGM_1788580056775_gom7dz6qa',
        'MGM_1788580057794_baa791584',
        'MGM_1788580058760_uqliqqh6i',
      ]},
    });
    results.payments = p.deletedCount;

    const n = await this.logModel.deleteMany({
      $or: [
        { relatedId: { $in: ['GM-369737', 'LD-719374', 'MGM_1788580016277_z0vd201ra', 'MGM_1788580056775_gom7dz6qa', 'MGM_1788580057794_baa791584', 'MGM_1788580058760_uqliqqh6i'] } },
        { relatedId: { $regex: /^GM-369737-/ } },
      ],
    });
    results.notificationLogs = n.deletedCount;

    return { status: 'success', message: 'Test data cleaned up', data: results };
  }
}
