import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Grievance, GrievanceDocument } from '../grievances/schema/grievances.schema';
import { Payment, PaymentDocument } from '../payments/schema/payments.schema';
import { Consent, ConsentDocument } from '../consents/schema/consents.schema';
import { makeResponse } from '../common/helpers/response.helper';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private gaClient: any = null;
  private gaPropertyId: string = '';

  constructor(
    @InjectModel(Grievance.name) readonly grievanceModel: Model<GrievanceDocument>,
    @InjectModel(Payment.name) readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Consent.name) readonly consentModel: Model<ConsentDocument>,
    private readonly config: ConfigService,
  ) {
    this.initGA4();
  }

  private initGA4() {
    try {
      const propertyId = this.config.get<string>('GA4_PROPERTY_ID');
      const serviceAccountKey = this.config.get<string>('GA4_SERVICE_ACCOUNT_KEY');
      const serviceAccountFile = this.config.get<string>('GA4_SERVICE_ACCOUNT_KEY_FILE');
      const fs = require('fs');

      let credentials: any;
      if (serviceAccountKey) {
        credentials = JSON.parse(serviceAccountKey);
      } else if (serviceAccountFile && fs.existsSync(serviceAccountFile)) {
        credentials = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf-8'));
      } else {
        this.logger.warn('GA4 not configured. Dashboard analytics will show zeros.');
        return;
      }

      if (!propertyId) {
        this.logger.warn('GA4_PROPERTY_ID not set. Dashboard analytics will show zeros.');
        return;
      }

      const { BetaAnalyticsDataClient } = require('@google-analytics/data');

      this.gaClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      });

      this.gaPropertyId = propertyId;
      this.logger.log(`GA4 connected for property: ${propertyId}`);
    } catch (err: any) {
      this.logger.error(`GA4 init failed: ${err.message}`);
    }
  }

  private dateRange(days: number) {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }

  private prevDateRange(days: number) {
    const end = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const start = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }

  private async runReport(dateRanges: any[], metrics: any[], dimensions?: any[], limit?: number) {
    if (!this.gaClient) return null;
    try {
      const [response] = await this.gaClient.runReport({
        property: `properties/${this.gaPropertyId}`,
        dateRanges,
        metrics,
        ...(dimensions ? { dimensions } : {}),
        ...(limit ? { limit } : {}),
      });
      return response;
    } catch (err: any) {
      this.logger.error(`GA4 report error: ${err.message}`);
      return null;
    }
  }

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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentGrievances, recentPayments, recentConsents] = await Promise.all([
      this.grievanceModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.paymentModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.consentModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    // Fetch GA4 data if configured
    let ga = {
      totalUsers: 0,
      activeUsers: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      usersChange: 0,
      activeUsersChange: 0,
      pageViewsChange: 0,
      topPages: [] as any[],
      trafficSources: [] as any[],
    };

    if (this.gaClient) {
      try {
        const range = this.dateRange(30);
        const prevRange = this.prevDateRange(30);

        // Current period metrics
        const [currentRes] = await this.gaClient.runReport({
          property: `properties/${this.gaPropertyId}`,
          dateRanges: [range],
          metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
        });

        // Previous period for change calc
        const [prevRes] = await this.gaClient.runReport({
          property: `properties/${this.gaPropertyId}`,
          dateRanges: [prevRange],
          metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
          ],
        });

        const curr = currentRes?.rows?.[0]?.metricValues || [];
        const prev = prevRes?.rows?.[0]?.metricValues || [];

        const totalUsers = parseInt(curr[0]?.value || '0');
        const prevUsers = parseInt(prev[0]?.value || '1');
        const activeUsers = parseInt(curr[1]?.value || '0');
        const prevActive = parseInt(prev[1]?.value || '1');
        const pageViews = parseInt(curr[2]?.value || '0');
        const prevPages = parseInt(prev[2]?.value || '1');

        ga = {
          totalUsers,
          activeUsers,
          pageViews,
          bounceRate: parseFloat(curr[3]?.value || '0'),
          avgSessionDuration: parseFloat(curr[4]?.value || '0'),
          usersChange: prevUsers ? Math.round(((totalUsers - prevUsers) / prevUsers) * 100) : 0,
          activeUsersChange: prevActive ? Math.round(((activeUsers - prevActive) / prevActive) * 100) : 0,
          pageViewsChange: prevPages ? Math.round(((pageViews - prevPages) / prevPages) * 100) : 0,
          topPages: [],
          trafficSources: [],
        };

        // Top pages
        const [pagesRes] = await this.gaClient.runReport({
          property: `properties/${this.gaPropertyId}`,
          dateRanges: [range],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          limit: 10,
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        });

        ga.topPages = (pagesRes?.rows || []).map((r: any) => ({
          page: r.dimensionValues?.[0]?.value || '',
          views: parseInt(r.metricValues?.[0]?.value || '0'),
        }));

        // Traffic sources
        const [sourceRes] = await this.gaClient.runReport({
          property: `properties/${this.gaPropertyId}`,
          dateRanges: [range],
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'sessions' }],
          limit: 10,
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        });

        ga.trafficSources = (sourceRes?.rows || []).map((r: any) => ({
          source: r.dimensionValues?.[0]?.value || 'Direct',
          sessions: parseInt(r.metricValues?.[0]?.value || '0'),
        }));
      } catch (err: any) {
        this.logger.error(`GA4 overview fetch failed: ${err.message}`);
      }
    }

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
        ga,
      },
    });
  }

  async getTraffic(period: string = '7d') {
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;

    if (!this.gaClient) {
      const daily = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        daily.push({ date: date.toISOString().split('T')[0], visitors: 0, pageViews: 0 });
      }
      return makeResponse({
        statusCode: 200, title: 'Traffic Data', message: 'Data retrieved', status: 'success',
        data: { daily, sources: [] },
      });
    }

    try {
      const range = this.dateRange(days);

      const [dailyRes] = await this.gaClient.runReport({
        property: `properties/${this.gaPropertyId}`,
        dateRanges: [range],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      });

      const daily = (dailyRes?.rows || []).map((r: any) => ({
        date: r.dimensionValues?.[0]?.value || '',
        visitors: parseInt(r.metricValues?.[0]?.value || '0'),
        pageViews: parseInt(r.metricValues?.[1]?.value || '0'),
      }));

      // Fill gaps for days with no traffic
      const filled = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const existing = daily.find((d: any) => d.date === dateStr);
        filled.push(existing || { date: dateStr, visitors: 0, pageViews: 0 });
      }

      // Traffic sources
      const [sourceRes] = await this.gaClient.runReport({
        property: `properties/${this.gaPropertyId}`,
        dateRanges: [range],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      });

      const sources = (sourceRes?.rows || []).map((r: any) => ({
        source: r.dimensionValues?.[0]?.value || 'Direct',
        sessions: parseInt(r.metricValues?.[0]?.value || '0'),
      }));

      return makeResponse({
        statusCode: 200, title: 'Traffic Data', message: 'Data retrieved', status: 'success',
        data: { daily: filled, sources },
      });
    } catch (err: any) {
      this.logger.error(`GA4 traffic fetch failed: ${err.message}`);
      const daily = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        daily.push({ date: date.toISOString().split('T')[0], visitors: 0, pageViews: 0 });
      }
      return makeResponse({
        statusCode: 200, title: 'Traffic Data', message: 'Data retrieved', status: 'success',
        data: { daily, sources: [] },
      });
    }
  }

  async getPageViews() {
    if (!this.gaClient) {
      return makeResponse({
        statusCode: 200, title: 'Page Views', message: 'Data retrieved', status: 'success',
        data: { pages: [] },
      });
    }

    try {
      const range = this.dateRange(30);
      const [res] = await this.gaClient.runReport({
        property: `properties/${this.gaPropertyId}`,
        dateRanges: [range],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 20,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      });

      const pages = (res?.rows || []).map((r: any) => ({
        page: r.dimensionValues?.[0]?.value || '',
        views: parseInt(r.metricValues?.[0]?.value || '0'),
      }));

      return makeResponse({
        statusCode: 200, title: 'Page Views', message: 'Data retrieved', status: 'success',
        data: { pages },
      });
    } catch (err: any) {
      this.logger.error(`GA4 page views fetch failed: ${err.message}`);
      return makeResponse({
        statusCode: 200, title: 'Page Views', message: 'Data retrieved', status: 'success',
        data: { pages: [] },
      });
    }
  }

  async getRealtime() {
    if (!this.gaClient) {
      return makeResponse({
        statusCode: 200, title: 'Realtime', message: 'Data retrieved', status: 'success',
        data: { activeUsers: 0 },
      });
    }

    try {
      const [res] = await this.gaClient.runRealtimeReport({
        property: `properties/${this.gaPropertyId}`,
        metrics: [{ name: 'activeUsers' }],
      });

      const activeUsers = parseInt(res?.rows?.[0]?.metricValues?.[0]?.value || '0');

      return makeResponse({
        statusCode: 200, title: 'Realtime', message: 'Data retrieved', status: 'success',
        data: { activeUsers },
      });
    } catch (err: any) {
      this.logger.error(`GA4 realtime fetch failed: ${err.message}`);
      return makeResponse({
        statusCode: 200, title: 'Realtime', message: 'Data retrieved', status: 'success',
        data: { activeUsers: 0 },
      });
    }
  }
}
