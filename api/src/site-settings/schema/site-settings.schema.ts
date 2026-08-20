import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true })
export class SiteSettings {
  @Prop({ type: [String], default: ['Kotak Mahindra Bank', 'Union Bank of India'] })
  bankNames!: string[];

  @Prop({ type: Object, default: {} })
  stats!: {
    yearsOfLending?: number;
    customersServed?: number;
    employees?: number;
    operationalLocations?: number;
    loansDisbursedCr?: number;
  };

  @Prop({ type: [{ year: String, title: String, desc: String }], default: [] })
  milestones!: { year: string; title: string; desc: string }[];

  @Prop({ default: 'RBI-registered NBFC' })
  rbiWording!: string;

  @Prop({ default: 'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation' })
  companyTagline!: string;

  @Prop({ default: 'Building Trust, Delivering Growth' })
  heroTitle!: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
