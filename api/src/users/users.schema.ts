import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActiveStatus, Role } from '../commons/enum/enums';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  lastName: string

  @Prop({ type: Date, required: false })
  dateOfBirth: Date

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  county: string;

  @Prop({ type: String, enum: ActiveStatus, default: ActiveStatus.Active })
  status: ActiveStatus;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zipcode: string;

  @Prop({ required: false })
  position: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: Boolean, required: false, default: true })
  changePassword: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
