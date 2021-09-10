import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFieldsDto, BaseQueryDto } from '../base/base.dto';
import { buildFilter } from '../utils';
import { ProductDto } from './products.dto';
import { Product, ProductDocument } from './products.schema';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  fields: BaseFieldsDto[] = [
    {fieldName: 'model', fieldType : 'string'},
    {fieldName: 'description', fieldType : 'string'},
    {fieldName: 'type', fieldType : 'string'},
    {fieldName: 'brand.name', fieldType : 'string'}
  ];

  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}
  
  async create(newProduct: ProductDto): Promise<ProductDocument> {
    const createdProduct = new this.model(newProduct);
    return createdProduct.save();
  }

  async update(id: string, product: Partial<ProductDto>): Promise<ProductDocument> {
    return this.model.findByIdAndUpdate(id, product).exec();
  }

  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { _id: 'asc'}): Promise<ProductDocument[]> {
    return this.model.find(buildFilter(filter, this.fields))
      .limit(Number(limit))
      .skip(Number(pageNumber) * Number(limit))
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .populate({ path: 'brand', model: 'Categories' })
      .exec();
  }

  async findOne(filter: any): Promise<ProductDocument> {
    return this.model.findOne(filter)
      .exec();
  }

  async findById(id: string): Promise<ProductDocument> {
    return this.model.findById(id)
      .exec();
  }
  
  async deleteById(id: string): Promise<ProductDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    return this.model.count(buildFilter(filter, this.fields)).exec();
  }
}
