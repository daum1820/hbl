import { IsArray, IsDate, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { Product } from '../products/products.schema';
import { BaseIdDto } from '../base/base.dto';

import { InvoiceDocument, InvoiceItemDocument } from './invoices.schema';
import { Customer } from '../customers/customers.schema';
import { DueDate, InvoiceStatus } from '../commons/enum/enums';
import { User } from '../users/users.schema';
import { reduceModel } from '../utils';

export class InvoiceStatusDto {
  status: InvoiceStatus
}

export class InvoiceItemDto extends BaseIdDto {

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  product: Product;

  constructor(invoiceItem?: InvoiceItemDocument) {
    super(invoiceItem?._id);

    if (invoiceItem) {
      this.description = invoiceItem.description;
      this.price = invoiceItem.quantity;
      this.product = invoiceItem.product;
      this.quantity = invoiceItem.quantity;
    }
  }
}

export class InvoiceDto extends BaseIdDto {

  @IsNumber()
  @IsOptional()
  invoiceNumber: number;

  customer: Customer;

  @IsDate()
  dueDate: Date;

  @IsDate()
  paidDate: Date;

  @IsEnum(DueDate, { each : true })
  due: String;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsNumber()
  @IsOptional()
  amountPaid: number;

  @IsOptional()
  items: {};

  @IsEnum(InvoiceStatus, { each : true })
  status: InvoiceStatus;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  createdBy: User;
  
  lastUpdatedBy: User;

  constructor(invoice?: InvoiceDocument) {
    super(invoice?._id);

    if (invoice) {
      this.invoiceNumber = invoice.invoiceNumber;
      this.dueDate = invoice.dueDate;
      this.paidDate = invoice.paidDate;
      this.amount = invoice.amount;
      this.discount = invoice.discount;
      this.amountPaid = invoice.amountPaid;
      this.items = invoice.items.reduce(reduceModel(), {});
      this.status = invoice.status;
      this.customer = invoice.customer;
      this.createdAt = invoice.createdAt;
      this.updatedAt = invoice.updatedAt;
      this.createdBy = invoice.createdBy;
      this.lastUpdatedBy = invoice.lastUpdatedBy;
    }
  }
}