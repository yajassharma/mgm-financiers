import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConsentsService } from './consents.service';
import { AdminJwtGuard } from 'src/common/guards/admin-jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import moment from 'moment-timezone';

@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Get()
  @UseGuards(AdminJwtGuard)
  @Roles('admin', 'superadmin')
  findAll(
    @Req() req: any,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.consentsService.allConsents(
      search,
      status,
      page,
      limit,
      req.user.roles[0] as string,
    );
  }

  @Post('sent-consent')
  @UseGuards(AdminJwtGuard)
  @Roles('superadmin')
  sent(
    @Req() req: any,
    @Body()
    body: {
      name: string;
      mobile: string;
      pan: string;
      loanPurpose: string;
    },
  ) {
    return this.consentsService.sentConsentLink(body, req.user._id as string);
  }

  @Post('resent-link')
  @UseGuards(AdminJwtGuard)
  @Roles('superadmin')
  resentLink(
    @Body()
    body: {
      _id: string;
    },
  ) {
    return this.consentsService.resentConsentLink(body);
  }

  @Get('verify-link')
  verifyLink(
    @Query('consentId')
    consentId: string,
  ) {
    return this.consentsService.verifyConsentLink(consentId);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body()
    body: {
      consentId: string;
      otp: string;
    },
  ) {
    return this.consentsService.verifyOtp(body.consentId, body.otp);
  }

  @Post('approve-consent')
  approveConsent(
    @Body()
    body: {
      consentId: string;
    },
  ) {
    return this.consentsService.approveConsent(body.consentId);
  }

  @Get('export-xlsx')
  @UseGuards(AdminJwtGuard)
  @Roles('admin', 'superadmin')
  async exportXlsx(
    @Res() res: Response,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ) {
    const consents = await this.consentsService.allConsents(
      search,
      status,
      page,
      limit,
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Consents');

    sheet.columns = [
      { header: 'Consent ID', key: 'consentId', width: 18 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'PAN', key: 'pan', width: 15 },
      { header: 'Loan Purpose', key: 'loanPurpose', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Captured At', key: 'consentedCaptureTime', width: 20 },
    ];

    consents?.data?.items.forEach((c) => {
      sheet.addRow({
        consentId: c.consentId,
        name: c.name,
        mobile: c.mobile,
        pan: c.pan,
        loanPurpose: c.loanPurpose,
        status: c.status,
        createdAt: moment(c.createdAt).tz('Asia/Kolkata').format('lll'),

        consentedCaptureTime: c.consentedCaptureTime
          ? moment(c.consentedCaptureTime).tz('Asia/Kolkata').format('lll')
          : '',
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="consents.xlsx"',
    );

    res.end(buffer);
  }
}
