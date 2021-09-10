import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrinterDto } from './printers.dto';
import { Printer, PrinterDocument } from './printers.schema';

@Injectable()
export class PrintersService {
  private readonly logger = new Logger(PrintersService.name);

  constructor(@InjectModel(Printer.name) private model: Model<PrinterDocument>) {}
  
  async create(newPrinter: PrinterDto): Promise<PrinterDocument> {
    const createdPrinter = new this.model(newPrinter);
    return createdPrinter.save();
  }

  async update(id: string, printer: Partial<PrinterDto>): Promise<PrinterDocument> {
    return this.model.findByIdAndUpdate(id, printer).exec();
  }

  async findAll(filter?: any): Promise<PrinterDocument[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: any): Promise<PrinterDocument> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<PrinterDocument> {
    return this.model.findById(id).exec();
  }
  
  async deleteById(id: string): Promise<PrinterDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }
}
