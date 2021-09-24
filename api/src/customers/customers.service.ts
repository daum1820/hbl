import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrinterDto } from '../printers/printers.dto';
import { CustomerDto } from './customers.dto';
import { Customer, CustomerDocument } from './customers.schema';
import { PrintersService } from '../printers/printers.service';
import { BaseFieldsDto, BaseQueryDto, PincodeDto } from '../base/base.dto';
import { buildFilter, generatePincode } from '../utils';
import { PrinterDocument } from '../printers/printers.schema';
@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  fields: BaseFieldsDto[] = [
    {fieldName: 'customerNumber', fieldType : 'number'},
    {fieldName: 'name', fieldType : 'string'},
    {fieldName: 'fullName', fieldType : 'string'},
    {fieldName: 'contactName', fieldType : 'string'},
    {fieldName: 'registrationNr', fieldType : 'string'},
  ];

  constructor(
    @InjectModel(Customer.name) private model: Model<CustomerDocument>,
    private printersService: PrintersService) {
  }
  
  async create(newCustomer: CustomerDto): Promise<CustomerDocument> {
    newCustomer.pincode = generatePincode();
    const createdCustomer = new this.model(newCustomer);
    return createdCustomer.save();
  }

  async update(id: string, customer: Partial<CustomerDto>): Promise<CustomerDocument> {
    const { printers, ...customerDto } = customer;
    return this.model.findByIdAndUpdate(id, customerDto).exec();
  }

  async pincode(id: string): Promise<CustomerDocument> {
    const pincode = generatePincode();
    return this.model.findByIdAndUpdate(id, { pincode }).exec();
  }


  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { _id: 'asc'}): Promise<CustomerDocument[]> {
    return this.model.find(buildFilter(filter, this.fields))
      .limit(Number(limit))
      .skip(Number(pageNumber) * Number(limit))
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .populate('printers')
      .populate({ path: 'printers', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'printers', populate: { path: 'product', populate: { path: 'brand' , model: 'Categories' } }})
      .exec();
  }

  async findOne(filter: any): Promise<CustomerDocument> {
    return this.model.findOne(filter)
      .populate('printers')
      .populate({ path: 'printers', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'printers', populate: { path: 'product', populate: { path: 'brand' , model: 'Categories' } }})
      .exec();
  }

  async findById(id: string): Promise<CustomerDocument> {
    return this.model.findById(id)
      .populate('printers')
      .populate({ path: 'printers', populate: { path: 'product' , model: 'Product' }})
      .populate({ path: 'printers', populate: { path: 'product', populate: { path: 'brand' , model: 'Categories' } }})
      .exec();
  }

  async addPrinter(id: string, printerDto: PrinterDto): Promise<PrinterDocument> {
    const printer:PrinterDocument = await this.printersService.create(printerDto);

    await this.model.findByIdAndUpdate(
        id,
        { $push: { printers: printer } }
      ).exec();
    
    return printer.populate('product')
      .populate({ path: 'product', populate: { path: 'brand' , model: 'Categories' }})
      .execPopulate();
  }

  async removePrinter(id: string, printer: Partial<PrinterDto>): Promise<CustomerDocument> {
    await this.printersService.deleteById(printer._id);

    return this.model.findByIdAndUpdate(
        id,
        { $pull : { printers: { _id : printer._id } } }
      ).exec();
  }
  
  async deleteById(id: string): Promise<CustomerDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    return this.model.count(buildFilter(filter, this.fields)).exec();
  }
}
