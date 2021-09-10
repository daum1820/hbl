import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SettingsDocument = Settings & mongoose.Document;

@Schema({ _id: false })
export class CompanySettings {
  @Prop({ required: false })
  registrationNr: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  extraInfo: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  county: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zipCode: string;

  @Prop({ required: false })
  contactPhone: string;

  @Prop({ required: false })
  invoiceEMail: string;

  @Prop({ required: false })
  orderEmail: string;
}

export const CompanySettingsSchema = SchemaFactory.createForClass(CompanySettings);

@Schema({ _id: false })
export class Settings {

  @Prop(CompanySettingsSchema)
  company: CompanySettings;

  constructor(customer: Partial<Settings>) {
    Object.assign(this, customer);
  }
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
