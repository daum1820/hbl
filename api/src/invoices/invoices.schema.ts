import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/products.schema';
import { Customer, CustomerSchema } from '../customers/customers.schema';
import { InvoiceStatus } from '../commons/enum/enums';
import { User, UserSchema } from '../users/users.schema';

export type InvoiceDocument = Invoice & mongoose.Document;
export type InvoiceItemDocument = InvoiceItem & mongoose.Document;

@Schema({ timestamps: true })
export class InvoiceItem {

  @Prop({ required: false })
  description: string;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop(ProductSchema)
  product: Product;

  constructor(invoiceItem: Partial<InvoiceItem>) {
    Object.assign(this, invoiceItem);
  }
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
@Schema({ timestamps: true })
export class Invoice {

  _id: mongoose.ObjectId;

  @Prop({ type: Number, required: true, default: 0})
  invoiceNumber: number;

  @Prop(CustomerSchema)
  customer: Customer;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Date, required: false })
  paidDate: Date;

  @Prop({ type: Number, required: false, default: 0 })
  amount: number;

  @Prop({ type: Number, required: false, default: 0})
  discount: number;

  @Prop({ type: Number, required: false, default: 0 })
  amountPaid: number;

  @Prop([InvoiceItemSchema])
  items: InvoiceItem[];

  @Prop({ type: String, enum: InvoiceStatus, default: InvoiceStatus.Open })
  status: InvoiceStatus;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop(UserSchema)
  createdBy: User;

  @Prop(UserSchema)
  lastUpdatedBy: User;

  @Prop({ required: false })
  notes: string;

  constructor(invoice: Partial<Invoice>) {
    Object.assign(this, invoice);
  }
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
