import { Module } from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoices.schema';

import { PdfModule } from '../pdf/pdf.module';
import { autoIncrementFactory } from '../database/database.utils';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Invoice.name,
        useFactory: autoIncrementFactory(InvoiceSchema, 'invoiceNumber', 1000),
        inject: [getConnectionToken()],
      }
    ]),
    PdfModule
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController]
})
export class InvoicesModule {}
