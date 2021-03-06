
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../customers/customers.schema';
import { Printer, PrinterSchema } from '../printers/printers.schema';
import { Categories, CategoriesSchema } from '../categories/categories.schema';
import { OrderStatus, OrderItemStatus } from '../commons/enum/enums';
import { User, UserSchema } from '../users/users.schema';

export type OrderDocument = Order & mongoose.Document;
export type OrderItemDocument = OrderItem & mongoose.Document;
@Schema()
export class OrderItem {

  _id: mongoose.ObjectId;

  @Prop({ type: String, enum: OrderItemStatus, default: OrderItemStatus.Open })
  status: OrderItemStatus;

  @Prop(PrinterSchema)
  printer: Printer;
  
  @Prop({ type: Number, required: false, default: 0 })
  currentPB: number;

  @Prop({ type: Number, required: false, default: 0 })
  currentColor: number;

  @Prop({ type: Number, required: false, default: 0 })
  currentCredit: number;

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

  @Prop({ required: false })
  approvedBy: string;

  @Prop({ type: Date })
  approvedAt: Date;

  @Prop({ type: Boolean })
  approvedByCustomer: boolean;

  constructor(orderItem: Partial<OrderItem>) {
    Object.assign(this, orderItem);
  }
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {

  _id: mongoose.ObjectId;

  @Prop({ type: Number, required: true })
  problem: Categories;

  @Prop({ type: Number, required: true, default: 0})
  orderNumber: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Empty })
  status: OrderStatus;

  @Prop(CustomerSchema)
  customer: Customer;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop(UserSchema)
  technicalUser: User;

  @Prop(UserSchema)
  createdBy: User;

  @Prop(UserSchema)
  lastUpdatedBy: User;

  @Prop([OrderItemSchema])
  items: OrderItem[];

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);