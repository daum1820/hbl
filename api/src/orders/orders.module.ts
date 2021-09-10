import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { PdfModule } from '../pdf/pdf.module';
import { Order, OrderSchema } from './orders.schema';
import { autoIncrementFactory } from '../database/database.utils';

@Module({
  imports:[
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: autoIncrementFactory(OrderSchema, 'orderNumber', 1000),
        inject: [getConnectionToken()],
      }
    ]),
    PdfModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
