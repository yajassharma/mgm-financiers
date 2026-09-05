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

    const g = await this.grievanceModel.deleteOne({ grievanceId: 'GM-489632' });
    results.grievances = g.deletedCount;

    const n = await this.logModel.deleteMany({
      $or: [
        { relatedId: 'GM-489632' },
        { relatedId: { $regex: /^GM-489632-/ } },
      ],
    });
    results.notificationLogs = n.deletedCount;

    return { status: 'success', message: 'Test data cleaned up', data: results };
  }
}
