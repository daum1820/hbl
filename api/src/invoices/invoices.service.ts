import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import ms from 'ms';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initialData } from '../database/database.utils';
import { InvoiceDto, InvoiceItemDto } from './invoices.dto';
import { Invoice, InvoiceDocument } from './invoices.schema';
import { PdfService } from '../pdf/pdf.service';
import { InvoiceStatus } from '../commons/enum/enums';
import { BaseFieldsDto, BaseQueryDto } from '../base/base.dto';
import { buildArrayFilter } from '../utils';
import { UserDto } from '../users/users.dto';
import { User } from '../users/users.schema';

declare function emit(k, v);

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  fields: BaseFieldsDto[] = [
    {fieldName: 'invoiceNumber', fieldType : 'number'},
    {fieldName: 'status', fieldType : 'string'},
    {fieldName: 'customer.name', fieldType : 'string'},
    {fieldName: 'customer.registrationNr', fieldType : 'string'},
    {fieldName: 'customer.contactName', fieldType : 'string'},
    {fieldName: 'customer.contactEmail', fieldType : 'string'},
  ];

  constructor(
    @InjectModel(Invoice.name) private model: Model<InvoiceDocument>,
    private pdfService: PdfService,
    
  ) {
    initialData(model, [], Invoice.name, this.logger);
  }
  
  async create(newInvoice: Partial<InvoiceDto>, user: UserDto): Promise<InvoiceDocument> {
    
    if(!!newInvoice.due) {
      const dueDate = new Date();
      dueDate.setTime(dueDate.getTime() + ms(newInvoice.due));
      newInvoice.dueDate = dueDate;
    }

    const createdInvoice = new this.model({ ...newInvoice, createdBy: user._id });
    return createdInvoice.save();
  }

  async update(id: string, invoice: Partial<Invoice>, user: UserDto): Promise<InvoiceDocument> {

    return this.model.findByIdAndUpdate(id, {...invoice, lastUpdatedBy: user._id as unknown as User })
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'items', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }


  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { _id: 'asc'}): Promise<InvoiceDocument[]> {
    const { search, ...rest } = filter;
    const items = await this.find(rest, sort);
    
    return items.filter(buildArrayFilter(search, this.fields)).slice(pageNumber * limit, (pageNumber + 1) * limit);
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    const { search, ...rest } = filter;
    const items = await this.find(rest);
    return items.filter(buildArrayFilter(search, this.fields)).length;
  }

  async amount(filter: BaseQueryDto = {}): Promise<number> {
    const { search, ...rest } = filter;

    const reduce = {
      map : function () { emit(1, this.amount - this.discount - this.amountPaid) },
      reduce: function (k, vals) { 
        const reducer = (accumulator, curr) => accumulator + curr;
        return vals.reduce(reducer, 0);
      },
      query: rest,
    };

    const resultAmount = await this.model.mapReduce(reduce);
    
    return resultAmount.results[0]?.value || 0;
  }

  async findOne(filter: any): Promise<InvoiceDocument> {
    return this.model.findOne(filter)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'items', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }

  async findById(id: string): Promise<InvoiceDocument> {
    return this.model.findById(id)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'items', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }
  
  async deleteById(id: string): Promise<InvoiceDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async changeStatus(id: string, status: InvoiceStatus, lastUpdatedBy: UserDto): Promise<InvoiceDocument> {
    const invoice = await this.model.findById(id).exec();

    switch (status) {
      case InvoiceStatus.Open:
        invoice.amountPaid = 0;
        break;
      case InvoiceStatus.Closed:
        invoice.amountPaid = invoice.amount - invoice.discount;
        break;
    }
    
    invoice.status = status;

    return this.model.findByIdAndUpdate(id, { ...invoice, lastUpdatedBy: lastUpdatedBy._id as unknown as User }).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async addItem(id: string, item: InvoiceItemDto, lastUpdatedBy: UserDto): Promise<InvoiceDocument> {
    item._id = mongoose.Types.ObjectId().toString();

    return this.model.findByIdAndUpdate(
        id,
        { 
          lastUpdatedBy: lastUpdatedBy._id as unknown as User,
          $push: { items: item },
          $inc: { amount: item.price * item.quantity }
        }
      ).exec();
  }

  async removeItem(id: string, item: InvoiceItemDto, lastUpdatedBy: User): Promise<InvoiceDocument> {
    return this.model.findByIdAndUpdate(
        id,
        { 
          lastUpdatedBy,
          $pull : { items: { _id: item._id }},
          $inc: { amount: item.price * item.quantity * -1 }
        }
      ).exec();
  }

  async export(id: string): Promise<PDFDocument> {
		const foundInvoice: Invoice = await this.model.findById(id)
    .populate({ path: 'customer', model: 'Customer' })
    .populate({ path: 'items', populate: { path: 'product' , model: 'Product' }});

		if (!foundInvoice) {
			throw new NotFoundException(`Invoice with ${id} not found.`);
		}

		return await this.pdfService.exportInvoice(foundInvoice);

	}

  private async find(filter = {}, sort: any = { _id: 'asc'}): Promise<InvoiceDocument[]> {
    Object.entries(filter).forEach(([k, v]) => filter[k] = ['null', 'undefined', ''].includes(v as string) ? null : v);

    return this.model.find(filter)
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .populate({ path: 'customer', model: 'Customer' })
      .populate({ path: 'items', populate: { path: 'product' , model: 'Product' }})
      .exec();
  }
}
