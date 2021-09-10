import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryTypes } from '../commons/enum/enums';

export type CategoriesDocument = Categories & mongoose.Document;
@Schema({ _id: false })
export class Categories {
  @Prop({ type: Number, required: false })
  _id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: CategoryTypes, default: CategoryTypes.Brand })
  type: CategoryTypes;

  constructor(name: string, type: CategoryTypes) {
    this.name = name;
    this.type = type;
  }
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
