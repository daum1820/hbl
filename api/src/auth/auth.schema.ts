import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: String, required: true })
  userId: string

  @Prop({ type: Boolean, required: true })
  isRevoked: boolean
  
  @Prop({ type: Date, required: true })
  expires: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);