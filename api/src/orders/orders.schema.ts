
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../customers/customers.schema';
import { Printer, PrinterSchema } from '../printers/printers.schema';
import { Categories, CategoriesSchema } from '../categories/categories.schema';
import { OrderStatus } from '../commons/enum/enums';
import { User, UserSchema } from '../users/users.schema';

export type OrderDocument = Order & mongoose.Document;

@Schema({ timestamps: true })
export class Order {

  _id: mongoose.ObjectId;

  @Prop({ type: Number, required: true })
  problem: Categories;

  @Prop({ type: Number, required: true, default: 0})
  orderNumber: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Open })
  status: OrderStatus;

  @Prop(CustomerSchema)
  customer: Customer;

  @Prop(PrinterSchema)
  printer: Printer;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop(UserSchema)
  technicalUser: User;
  
  @Prop({ type: Number, required: false, default: 0 })
  currentPB: number;

  @Prop({ type: Number, required: false, default: 0 })
  currentColor: number;

  @Prop({ required: false })
  notes: string;

  @Prop({ required: false })
  actions: string;

  @Prop({ required: false })
  points: string;

  @Prop({ required: false })
  nos: string;

  @Prop({ type: Date })
  startedAt: Date;

  @Prop({ type: Date })
  finishedAt: Date;

  @Prop(UserSchema)
  createdBy: User;

  @Prop(UserSchema)
  lastUpdatedBy: User;

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);