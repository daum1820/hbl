import { IsNumber, IsEnum, IsOptional, IsDate, IsString } from 'class-validator';
import { Categories } from '../categories/categories.schema';
import { Printer } from '../printers/printers.schema';
import { BaseIdDto } from '../base/base.dto';

import { Customer } from '../customers/customers.schema';
import { OrderDocument } from './orders.schema';
import { OrderStatus } from '../commons/enum/enums';
import { User } from '../users/users.schema';

export class OrderStatusDto {
  status: OrderStatus
}
export class OrderDto extends BaseIdDto {

  @IsNumber()
  @IsOptional()
  orderNumber: number;

  @IsNumber()
  problem: Categories;

  customer: Customer;

  printer: Printer;

  @IsEnum(OrderStatus, { each : true })
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  technicalUser: User;
  
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

  createdBy: User;
  
  lastUpdatedBy: User;

  constructor(order?: OrderDocument) {
    super(order?._id);

    if (order) {
      this.orderNumber = order.orderNumber;
      this.status = order.status;
      this.customer = order.customer;
      this.printer = order.printer;
      this.problem = order.problem;
      this.createdAt = order.createdAt;
      this.updatedAt = order.updatedAt;
      this.technicalUser = order.technicalUser;
      this.currentPB = order.currentPB;
      this.currentColor = order.currentColor;
      this.notes = order.notes;
      this.actions = order.actions;
      this.points = order.points;
      this.nos = order.nos;
      this.startedAt = order.startedAt;
      this.finishedAt = order.finishedAt;
      this.createdBy = order.createdBy;
      this.lastUpdatedBy = order.lastUpdatedBy;
    }
  }
}