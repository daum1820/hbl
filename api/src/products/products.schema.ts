import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from '../categories/categories.schema';
import { ProductTypes } from '../commons/enum/enums';

export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true })
export class Product {

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: ProductTypes, default: ProductTypes.Printer })
  type: ProductTypes;

  @Prop(CategoriesSchema)
  brand: Categories;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
