import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Printer, PrinterSchema } from '../printers/printers.schema';
import { ActiveStatus } from '../commons/enum/enums';

export type CustomerDocument = Customer & mongoose.Document;
@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: false })
  customerNumber: number;

  @Prop({ required: false })
  registrationNr: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: String, enum: ActiveStatus, default: ActiveStatus.Active })
  status: ActiveStatus;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zipcode: string;

  @Prop({ required: false })
  contactName: string;

  @Prop({ required: false })
  contactPhone: string;

  @Prop({ required: false })
  contactEmail: string;

  @Prop({ required: true })
  pincode: string;

  @Prop([PrinterSchema])
  printers: Printer[];

  constructor(customer: Partial<Customer>) {
    Object.assign(this, customer);
  }
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
