import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lead, LeadDocument } from './schema/leads.schema';
import { Model } from 'mongoose';
import { makeResponse } from '../common/helpers/response.helper';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) readonly model: Model<LeadDocument>,
  ) {}

  async createLead(body: any) {
    const { name, phone, email, loanType, amount, cibil, employment, purpose } = body;

    const lead = await this.model.create({
      name: name?.trim() || '',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      loanType: loanType?.trim() || '',
      amount: Number(amount) || 0,
      cibil: cibil?.trim() || '',
      employment: employment?.trim() || '',
      purpose: purpose?.trim() || '',
      source: 'Website - Apply Now',
      statusHistory: [
        { timestamp: new Date(), status: 'NEW', note: 'Lead submitted from website' },
      ],
    });

    return makeResponse({ statusCode: 201, status: 'success', title: 'Lead Created', message: 'Lead captured successfully.', data: lead });
  }

  async findAll(search: string, status: string, page = 1, limit = 10) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { leadId: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const result = await paginate(this.model, filter, { page, limit, sort: { createdAt: -1 } });

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'Data Found',
      message: 'Leads retrieved.',
      data: result,
    });
  }

  async findById(id: string) {
    const lead = await this.model.findById(id).exec();
    if (!lead) {
      return makeResponse({ statusCode: 404, status: 'error', title: 'Not Found', message: 'Lead not found.' });
    }
    return makeResponse({ statusCode: 200, status: 'success', title: 'Lead Found', message: 'Success', data: lead });
  }

  async getStats() {
    const total = await this.model.countDocuments().exec();
    const newLeads = await this.model.countDocuments({ status: 'NEW' }).exec();
    const contacted = await this.model.countDocuments({ status: 'CONTACTED' }).exec();
    const qualified = await this.model.countDocuments({ status: 'QUALIFIED' }).exec();
    const proposalSent = await this.model.countDocuments({ status: 'PROPOSAL_SENT' }).exec();
    const converted = await this.model.countDocuments({ status: 'CONVERTED' }).exec();
    const lost = await this.model.countDocuments({ status: 'LOST' }).exec();

    const loanTypeBreakdown = await this.model.aggregate([
      { $group: { _id: '$loanType', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
      { $sort: { count: -1 } },
    ]);

    const employmentBreakdown = await this.model.aggregate([
      { $group: { _id: '$employment', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.model.countDocuments({ createdAt: { $gte: today } }).exec();

    return makeResponse({
      statusCode: 200,
      status: 'success',
      title: 'Stats',
      message: 'Lead stats retrieved.',
      data: {
        total,
        newLeads,
        contacted,
        qualified,
        proposalSent,
        converted,
        lost,
        todayCount,
        conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
        loanTypeBreakdown,
        employmentBreakdown,
      },
    });
  }

  async updateStatus(id: string, body: { status?: string; notes?: string }) {
    const lead = await this.model.findById(id).exec();
    if (!lead) {
      return makeResponse({ statusCode: 404, status: 'error', title: 'Not Found', message: 'Lead not found.' });
    }

    if (body.status) {
      lead.status = body.status;
      lead.statusHistory.push({
        timestamp: new Date(),
        status: body.status,
        note: body.notes || `Status updated to ${body.status}`,
      });
      if (body.status === 'CONTACTED') lead.contactedAt = new Date();
      if (body.status === 'CONVERTED') lead.convertedAt = new Date();
      if (body.status === 'LOST') lead.lostAt = new Date();
    }

    if (body.notes && !body.status) {
      lead.notes = body.notes;
    }

    await lead.save();

    return makeResponse({ statusCode: 200, status: 'success', title: 'Updated', message: 'Lead updated successfully.', data: lead });
  }
}
