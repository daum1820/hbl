
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from '../products/products.schema';

export type PrinterDocument = Printer & mongoose.Document;

@Schema({ timestamps: true })
export class Printer {

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' })
  product: Product;

  constructor(printer: Partial<Printer>) {
    Object.assign(this, printer);
  }
}

export const PrinterSchema = SchemaFactory.createForClass(Printer);