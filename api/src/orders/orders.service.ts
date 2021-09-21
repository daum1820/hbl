import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initialData } from '../database/database.utils';
import { OrderDto, OrderItemDto, OrderStatusDto } from './orders.dto';
import { Order, OrderDocument } from './orders.schema';
import { PdfService } from '../pdf/pdf.service';
import { OrderStatus, OrderItemStatus } from '../commons/enum/enums';
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
    {fieldName: 'problem.name', fieldType : 'string'}
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

  async update(id: string, order: Partial<Order>, user: UserDto): Promise<OrderDocument> {
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
      .populate({ 
        path: 'customer', model: 'Customer', populate: 
        { path: 'printers' , model: 'Printer', populate: { 
          path: 'product' , model: 'Product', populate: { 
            path: 'brand' , model: 'Categories' }
          }
        }
      })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'technicalUser', model: 'User' })
      .populate({ path: 'items.printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }

  async findById(id: string): Promise<OrderDocument> {
    return this.model.findById(id)
      .populate({ 
        path: 'customer', model: 'Customer', populate: 
        { path: 'printers' , model: 'Printer', populate: { 
          path: 'product' , model: 'Product', populate: { 
            path: 'brand' , model: 'Categories' }
          }
        }
      })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'technicalUser', model: 'User' })
      .populate({ path: 'customer.printers', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'items.printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }
  
  async deleteById(id: string): Promise<OrderDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async close(id: string, lastUpdatedBy: UserDto): Promise<OrderDocument> {
    const order = await this.model.findById(id).exec();

    order.status = OrderStatus.Closed;
    order.items.forEach(i => {
      i.startedAt = !!i.startedAt ? i.startedAt : new Date();
      i.finishedAt = !!i.finishedAt ? i.finishedAt : new Date();
      i.status = OrderItemStatus.Closed
    });
    
    return this.model.findByIdAndUpdate(
      id,
      order
    ).exec();
  }

  async changeStatus(id: string, statusDto: OrderStatusDto, lastUpdatedBy: UserDto): Promise<OrderDocument> {
    const { itemOrderId, status } = statusDto;
    const order = await this.model.findById(id).exec();

    const itemOrder = order.items.find(i => i._id.toString() === itemOrderId);

    switch (status) {
      case OrderItemStatus.Wip:
        itemOrder.startedAt = !!itemOrder.startedAt ? itemOrder.startedAt : new Date();
        itemOrder.finishedAt = null;
        order.technicalUser = !!order.technicalUser ? order.technicalUser : lastUpdatedBy._id as unknown as User;
        break;
      case OrderItemStatus.Closed:
      case OrderItemStatus.Approve:
        itemOrder.finishedAt = !!itemOrder.finishedAt ? itemOrder.finishedAt : new Date();
        break;
    }

    itemOrder.status = status;

    await this.model.updateOne(
      { _id: id, 'items._id' : itemOrderId },
      { $set: {
        'items.$' : itemOrder,
        'technicalUser' : !!order.technicalUser ? order.technicalUser : lastUpdatedBy._id as unknown as User
      } }
    ).exec();

    return this.updateOrderStatus(id, lastUpdatedBy);
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async export(id: string): Promise<PDFDocument> {
		const foundOrder: Order = await this.model.findById(id)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'technicalUser', model: 'User' })
      .populate({ path: 'items.printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }});

		if (!foundOrder) {
			throw new NotFoundException(`Order with ${id} not found.`);
		}

		return await this.pdfService.exportOrder(foundOrder);

	}

  private async find(filter = {}, sort: any = { _id: 'asc'}): Promise<OrderDocument[]> {
    Object.entries(filter).forEach(([k, v]) => filter[k] = ['null', 'undefined', ''].includes(v as string) ? null : v);

    return this.model.find(filter)
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .populate({ 
        path: 'customer', model: 'Customer', populate: 
        { path: 'printers' , model: 'Printer', populate: { 
          path: 'product' , model: 'Product', populate: { 
            path: 'brand' , model: 'Categories' }
          }
        }
      })
      .populate({ path: 'problem', model: 'Categories' })
      .populate({ path: 'technicalUser', model: 'User' })
      .populate({ path: 'items.printer', model: 'Printer', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }

  async addItem(id: string, item: OrderItemDto, lastUpdatedBy: UserDto): Promise<OrderDocument> {
    item._id = mongoose.Types.ObjectId().toString();

    await this.model.findByIdAndUpdate(
      id,
      { 
        lastUpdatedBy: lastUpdatedBy._id as unknown as User,
        $push: { items: item },
      }
    ).exec();

    return this.updateOrderStatus(id, lastUpdatedBy);
  }

  async updateItem(id: string, item: OrderItemDto, lastUpdatedBy: UserDto): Promise<OrderDocument> {
    await this.model.updateOne(
      { _id: id, 'items._id' : item._id },
      { $set: {'items.$' : item } }
    ).exec();

    return this.updateOrderStatus(id, lastUpdatedBy);
  }

  async removeItem(id: string, item: OrderItemDto, lastUpdatedBy: User): Promise<OrderDocument> {

    await this.model.findByIdAndUpdate(
      id,
      { 
        lastUpdatedBy,
        $pull : { items: { _id: item._id }},
      }
    ).exec();

    return this.updateOrderStatus(id, lastUpdatedBy);
  }

  private async updateOrderStatus(id: string, lastUpdatedBy: UserDto) {
    const order = await this.model.findById(id).exec();
    order.status = order.items?.length == 0 ? OrderStatus.Empty :
      order.items?.some( i => i.status === OrderItemStatus.Approve) ? OrderStatus.Pending :
      order.items?.some( i => i.status === OrderItemStatus.Wip) ? OrderStatus.Wip :
      order.items?.some( i => i.status === OrderItemStatus.Open) ? OrderStatus.Open : OrderStatus.Closed;
    
    return this.model.findByIdAndUpdate(id, {
      ...order,
      lastUpdatedBy: lastUpdatedBy._id as unknown as User
    }).exec();
  }
  
}
