import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Grievance, GrievanceDocument } from './schema/grievances.schema';
import { Model, PipelineStage } from 'mongoose';
import { makeResponse } from 'src/common/helpers/response.helper';
import { paginate } from 'src/common/helpers/pagination.helper';
import { escapeRegex } from 'src/common/helpers/regex.helper';

@Injectable()
export class GrievancesService {
  constructor(
    @InjectModel(Grievance.name) readonly model: Model<GrievanceDocument>,
  ) {}

  async createGrievance(body: any) {
    const { name, customerName, email, mobile, phone, category, subject, description, loanType, loanAccountNumber, address } = body;
    if (!email || !subject || !description) {
      return makeResponse({
        statusCode: 400, title: 'Error',
        message: 'Email, subject, and description are required.',
        status: 'error',
      });
    }
    const grievance = await this.model.create({
      name: name || customerName || 'Anonymous',
      email,
      mobile: mobile || phone || 'Not Provided',
      category: category || loanType || 'General',
      subject,
      description,
      loanAccountNumber: loanAccountNumber || '',
      address: address || '',
      statusHistory: [{ timestamp: new Date(), status: 'RECEIVED', note: 'Grievance submitted' }],
    });
    return makeResponse({
      statusCode: 201, title: 'Grievance Submitted',
      message: 'Your grievance has been registered successfully.',
      status: 'success', data: grievance,
    });
  }

  async trackByEmail(body: { email: string }) {
    const grievances = await this.model.find({ email: body.email }).sort({ _id: -1 });
    return makeResponse({
      statusCode: 200, title: 'Grievances Found',
      message: 'Grievances retrieved successfully.', status: 'success', data: grievances,
    });
  }

  async trackById(grievanceId: string) {
    const grievance = await this.model.findOne({ grievanceId });
    if (!grievance) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Grievance not found.', status: 'error' });
    }
    return makeResponse({ statusCode: 200, title: 'Grievance Found', message: 'Success', status: 'success', data: grievance });
  }

  async findAll(search?: string, status?: string, page = 1, limit = 10) {
    const stages: PipelineStage[] = [];
    if (search) {
      const safeSearch = escapeRegex(search);
      stages.push({ $match: { $or: [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { mobile: { $regex: safeSearch, $options: 'i' } },
        { grievanceId: { $regex: safeSearch, $options: 'i' } },
        { subject: { $regex: safeSearch, $options: 'i' } },
      ]}});
    }
    if (status && status !== 'all') {
      stages.push({ $match: { status } });
    }
    const result = await paginate(this.model, {}, { page, limit, sort: { _id: -1 } }, stages);
    return makeResponse({ status: 'success', message: 'Data found', statusCode: 200, title: 'Data Found', data: result });
  }

  async updateStatus(id: string, body: { status?: string; customerUpdate?: string; internalNotes?: string }) {
    const grievance = await this.model.findById(id);
    if (!grievance) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Grievance not found.', status: 'error' });
    }
    if (body.status) grievance.status = body.status;
    if (body.customerUpdate) grievance.customerUpdate = body.customerUpdate;
    if (body.internalNotes) grievance.internalNotes = body.internalNotes;
    grievance.statusHistory.push({
      timestamp: new Date(),
      status: body.status || grievance.status,
      note: body.customerUpdate || `Status updated to ${body.status || grievance.status}`,
    });
    await grievance.save();
    return makeResponse({ statusCode: 200, title: 'Updated', message: 'Status updated successfully.', status: 'success', data: grievance });
  }

  async getStats() {
    const [total, received, inReview, pendingCustomer, resolved, closed] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: 'RECEIVED' }),
      this.model.countDocuments({ status: 'IN_REVIEW' }),
      this.model.countDocuments({ status: 'PENDING_CUSTOMER' }),
      this.model.countDocuments({ status: 'RESOLVED' }),
      this.model.countDocuments({ status: 'CLOSED' }),
    ]);
    return makeResponse({ statusCode: 200, title: 'Stats', message: 'Stats retrieved.', status: 'success', data: { total, open: received, inReview, pendingCustomer, resolved, closed } });
  }
}
