import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SiteSettings, SiteSettingsDocument } from './schema/site-settings.schema';
import { Model } from 'mongoose';
import { makeResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class SiteSettingsService implements OnModuleInit {
  constructor(
    @InjectModel(SiteSettings.name) readonly model: Model<SiteSettingsDocument>,
  ) {}

  async onModuleInit() {
    const exists = await this.model.findOne();
    if (!exists) {
      await this.model.create({
        bankNames: ['Kotak Mahindra Bank', 'Union Bank of India'],
        stats: {
          yearsOfLending: 28,
          customersServed: 3000,
          employees: 50,
          operationalLocations: 35,
          loansDisbursedCr: 25,
        },
        milestones: [
          { year: '1996', title: 'Foundation', desc: 'Established with a vision to make financial assistance accessible and honest.' },
          { year: '2005', title: 'Customer Growth', desc: 'Thousands of families and entrepreneurs trust us with their financial futures.' },
          { year: '2012', title: 'Regional Expansion', desc: 'Extended our reach across Punjab, Rajasthan, Haryana and Maharashtra.' },
          { year: '2013', title: 'Navi Mumbai Expansion', desc: 'Expanded operations to Navi Mumbai, strengthening our Maharashtra presence.' },
          { year: '2018', title: 'Branch Network', desc: 'Built a network of offices to serve customers with local, personal attention.' },
          { year: '2022', title: 'Digital Transformation', desc: 'Embraced technology to make processes faster while keeping the human touch.' },
          { year: '2025', title: 'Sri Ganganagar', desc: 'Expanded to Sri Ganganagar, Rajasthan.' },
          { year: '2026', title: 'Multi-City Expansion', desc: 'Expanded to Jaipur, Kota and Jhalawar in Rajasthan, and Gurugram in Haryana.' },
          { year: 'Today', title: 'Trusted Institution', desc: '3,000+ customers, 50+ employees, and a legacy built on relationships.' },
        ],
        rbiWording: 'RBI-registered NBFC',
        companyTagline: 'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation',
        heroTitle: 'Building Trust, Delivering Growth',
      });
      console.log('[SiteSettings] Default settings seeded');
    }
  }

  async get() {
    const settings = await this.model.findOne();
    if (!settings) {
      return makeResponse({ statusCode: 404, title: 'Not Found', message: 'Site settings not found.', status: 'error' });
    }
    return makeResponse({ statusCode: 200, title: 'Success', message: 'Settings retrieved.', status: 'success', data: settings });
  }

  async update(body: Partial<SiteSettings>) {
    let settings = await this.model.findOne();
    if (!settings) {
      settings = await this.model.create(body);
    } else {
      if (body.stats) {
        settings.stats = { ...settings.stats, ...body.stats };
        delete body.stats;
      }
      Object.assign(settings, body);
      await settings.save();
    }
    return makeResponse({ statusCode: 200, title: 'Updated', message: 'Settings updated successfully.', status: 'success', data: settings });
  }
}
