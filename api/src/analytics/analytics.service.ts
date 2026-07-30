import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grievance, GrievanceDocument } from '../grievances/schema/grievances.schema';
import { Payment, PaymentDocument } from '../payments/schema/payments.schema';
import { Consent, ConsentDocument } from '../consents/schema/consents.schema';
import { makeResponse } from '../common/helpers/response.helper';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Grievance.name) readonly grievanceModel: Model<GrievanceDocument>,
    @InjectModel(Payment.name) readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Consent.name) readonly consentModel: Model<ConsentDocument>,
  ) {}

  async getOverview() {
    const [
      totalGrievances, openGrievances, inProgressGrievances, resolvedGrievances, closedGrievances,
      totalPayments, successPayments, pendingPayments, failedPayments,
      totalConsents,
    ] = await Promise.all([
      this.grievanceModel.countDocuments(),
      this.grievanceModel.countDocuments({ status: 'OPEN' }),
      this.grievanceModel.countDocuments({ status: 'IN_PROGRESS' }),
      this.grievanceModel.countDocuments({ status: 'RESOLVED' }),
      this.grievanceModel.countDocuments({ status: 'CLOSED' }),
      this.paymentModel.countDocuments(),
      this.paymentModel.countDocuments({ status: 'SUCCESS' }),
      this.paymentModel.countDocuments({ status: 'PENDING' }),
      this.paymentModel.countDocuments({ status: 'FAILED' }),
      this.consentModel.countDocuments(),
    ]);

    const revenueResult = await this.paymentModel.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent activity counts (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentGrievances, recentPayments, recentConsents] = await Promise.all([
      this.grievanceModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.paymentModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.consentModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    return makeResponse({
      statusCode: 200,
      title: 'Analytics Overview',
      message: 'Data retrieved',
      status: 'success',
      data: {
        grievances: {
          total: totalGrievances,
          open: openGrievances,
          inProgress: inProgressGrievances,
          resolved: resolvedGrievances,
          closed: closedGrievances,
          recent: recentGrievances,
        },
        payments: {
          total: totalPayments,
          success: successPayments,
          pending: pendingPayments,
          failed: failedPayments,
          totalRevenue,
          recent: recentPayments,
        },
        consents: {
          total: totalConsents,
          recent: recentConsents,
        },
        // Placeholder for Google Analytics data
        ga: {
          totalUsers: 0,
          activeUsers: 0,
          pageViews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          usersChange: 0,
          activeUsersChange: 0,
          pageViewsChange: 0,
          topPages: [],
          trafficSources: [],
        },
      },
    });
  }

  async getTraffic(period: string = '7d') {
    // Placeholder for Google Analytics traffic data
    // When GA is configured, this will fetch real data
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const daily = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      daily.push({
        date: date.toISOString().split('T')[0],
        visitors: 0,
        pageViews: 0,
      });
    }

    return makeResponse({
      statusCode: 200,
      title: 'Traffic Data',
      message: 'Data retrieved',
      status: 'success',
      data: {
        daily,
        sources: [],
      },
    });
  }

  async getPageViews() {
    // Placeholder for Google Analytics page views
    return makeResponse({
      statusCode: 200,
      title: 'Page Views',
      message: 'Data retrieved',
      status: 'success',
      data: { pages: [] },
    });
  }

  async getRealtime() {
    return makeResponse({
      statusCode: 200,
      title: 'Realtime',
      message: 'Data retrieved',
      status: 'success',
      data: { activeUsers: 0 },
    });
  }
}
