import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Printer, PrinterSchema } from './printers.schema';
import { PrintersService } from './printers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Printer.name, schema: PrinterSchema }
    ]),
  ],
  providers: [PrintersService],
  exports: [PrintersService]
})
export class PrintersModule {}
