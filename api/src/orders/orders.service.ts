import PDFDocument from 'pdfkit';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initialData } from '../database/database.utils';
import { OrderDto } from './orders.dto';
import { Order, OrderDocument } from './orders.schema';
import { PdfService } from '../pdf/pdf.service';
import { OrderStatus } from '../commons/enum/enums';
import { buildArrayFilter } from '../utils';
import { BaseFieldsDto, BaseQueryDto } from '../base/base.dto';
import { User } from '../users/users.schema';
import { UserDto } from '../users/users.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  fields: BaseFieldsDto[] = [
    {fieldName: 'orderNumber', fieldType : 'number'},
    {fieldName: 'status', fieldType : 'string'},
    {fieldName: 'customer.name', fieldType : 'string'},
    {fieldName: 'problem.name', fieldType : 'string'},
    {fieldName: 'printer.serialNumber', fieldType : 'string'},
    {fieldName: 'printer.product.model', fieldType : 'string'},
  ];


  constructor(
    @InjectModel(Order.name) private model: Model<OrderDocument>,
    private pdfService: PdfService,
  ) {
    initialData(model, [], Order.name, this.logger);
  }
  
  async create(newOrder: OrderDto, user: UserDto): Promise<OrderDocument> {
    const createdOrder = new this.model({...newOrder, createdBy: user._id });
    return createdOrder.save();
  }

  async update(id: string, order: Partial<OrderDto>, user: UserDto): Promise<OrderDocument> {
    return this.model.findByIdAndUpdate(id, {...order, lastUpdatedBy: user._id as unknown as User}).exec();
  }

  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { _id: 'asc'}): Promise<OrderDocument[]> {
    const { search, ...rest } = filter;
    const items = await this.find(rest, sort);
    
    return items.filter(buildArrayFilter(search, this.fields)).slice(pageNumber * limit, (pageNumber + 1) * limit);
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    const { search, ...rest } = filter;
    const items = await this.find(rest);
    return items.filter(buildArrayFilter(search, this.fields)).length;
  }

  async findOne(filter: any): Promise<OrderDocument> {
    return this.model.findOne(filter)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'technicalUser', model: 'User' })
      .exec();
  }

  async findById(id: string): Promise<OrderDocument> {
    return this.model.findById(id)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'technicalUser', model: 'User' })
      .exec();
  }
  
  async deleteById(id: string): Promise<OrderDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async changeStatus(id: string, status: OrderStatus, lastUpdatedBy: UserDto): Promise<OrderDocument> {
    const order = await this.model.findById(id).exec();

    switch (status) {
      case OrderStatus.Open:
        order.startedAt = null;
        order.finishedAt = null;
        order.technicalUser = null;
        break;
      case OrderStatus.Wip:
        order.startedAt = !!order.startedAt ? order.startedAt : new Date();
        order.finishedAt = null;
        order.technicalUser = !!order.technicalUser ? order.technicalUser : lastUpdatedBy._id as unknown as User;
        break;
      case OrderStatus.Closed:
        order.finishedAt = !!order.finishedAt ? order.finishedAt : new Date();
        break;
    }
    order.status = status
    
    return this.model.findByIdAndUpdate(id, {
      ...order,
      lastUpdatedBy: lastUpdatedBy._id as unknown as User
    }).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async export(id: string): Promise<PDFDocument> {
		const foundOrder: Order = await this.model.findById(id)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'technicalUser', model: 'User' });

		if (!foundOrder) {
			throw new NotFoundException(`Order with ${id} not found.`);
		}

		return await this.pdfService.exportOrder(foundOrder);

	}

  private async find(filter = {}, sort: any = { _id: 'asc'}): Promise<OrderDocument[]> {
    Object.entries(filter).forEach(([k, v]) => filter[k] = ['null', 'undefined', ''].includes(v as string) ? null : v);

    return this.model.find(filter)
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'technicalUser', model: 'User' })
      .exec();
  }
  
}
