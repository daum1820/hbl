import { IsNumber, IsEnum, IsOptional, IsDate, IsString } from 'class-validator';
import { Categories } from '../categories/categories.schema';
import { Printer } from '../printers/printers.schema';
import { BaseIdDto } from '../base/base.dto';

import { Customer } from '../customers/customers.schema';
import { OrderDocument, OrderItemDocument } from './orders.schema';
import { OrderStatus, OrderItemStatus } from '../commons/enum/enums';
import { User } from '../users/users.schema';
import { reduceModel } from 'src/utils';

export class OrderStatusDto {
  status: OrderItemStatus
  itemOrderId: string
}
export class OrderItemDto extends BaseIdDto {

  printer: Printer;

  @IsEnum(OrderItemStatus, { each : true })
  status: OrderItemStatus;
  
  @IsNumber()
  @IsOptional()
  currentPB: number;

  @IsNumber()
  @IsOptional()
  currentColor: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  actions: string;

  @IsString()
  @IsOptional()
  points: string;

  @IsString()
  @IsOptional()
  nos: string;

  @IsDate()
  @IsOptional()
  startedAt: Date;

  @IsDate()
  @IsOptional()
  finishedAt: Date;

  constructor(orderItem?: OrderItemDocument) {
    super(orderItem?._id);

    if (orderItem) {
      this.status = orderItem.status;
      this.printer = orderItem.printer;
      this.currentPB = orderItem.currentPB;
      this.currentColor = orderItem.currentColor;
      this.notes = orderItem.notes;
      this.actions = orderItem.actions;
      this.points = orderItem.points;
      this.nos = orderItem.nos;
      this.startedAt = orderItem.startedAt;
      this.finishedAt = orderItem.finishedAt;
    }
  }
}
export class OrderDto extends BaseIdDto {

  @IsNumber()
  @IsOptional()
  orderNumber: number;

  @IsNumber()
  problem: Categories;

  customer: Customer;

  @IsEnum(OrderStatus, { each : true })
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  technicalUser: User;

  createdBy: User;
  
  lastUpdatedBy: User;

  @IsOptional()
  items: {};

  constructor(order?: OrderDocument) {
    super(order?._id);

    if (order) {
      this.orderNumber = order.orderNumber;
      this.status = order.status;
      this.customer = order.customer;
      this.problem = order.problem;
      this.createdAt = order.createdAt;
      this.updatedAt = order.updatedAt;
      this.technicalUser = order.technicalUser;
      this.createdBy = order.createdBy;
      this.lastUpdatedBy = order.lastUpdatedBy;
      this.items = order.items.reduce(reduceModel(), {});
    }
  }
}