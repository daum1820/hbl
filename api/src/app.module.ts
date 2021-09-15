import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DatabaseConnectionService } from './database/database-connection.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PdfModule } from './pdf/pdf.module';
import { CategoriesModule } from './categories/categories.module';
import { PrintersModule } from './printers/printers.module';
import { SettingsModule } from './settings/settings.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: (database: DatabaseConnectionService) => {
        return <MongooseModuleOptions>{
          uri: database.get(),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        };
      },
      inject: [DatabaseConnectionService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
    InvoicesModule,
    PrintersModule,
    CategoriesModule,
    PdfModule,
    SettingsModule,
    CommonsModule,
  ]
})
export class AppModule {}
