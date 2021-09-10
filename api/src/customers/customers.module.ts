import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customers.schema';
import { PrintersModule } from '../printers/printers.module';
import { autoIncrementFactory } from '../database/database.utils';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Customer.name,
        useFactory: autoIncrementFactory(CustomerSchema, 'customerNumber', 1000),
        inject: [getConnectionToken()],
      }
    ]),
    PrintersModule,
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports: [CustomersService]
})
export class CustomersModule {}
