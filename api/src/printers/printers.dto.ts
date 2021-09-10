import { IsString } from 'class-validator';
import { ProductDto } from '../products/products.dto';
import { BaseIdDto } from '../base/base.dto';
import { PrinterDocument } from './printers.schema';

export class PrinterDto extends BaseIdDto {

  @IsString()
  public serialNumber: string;

  public product: ProductDto;

  constructor(printer?: PrinterDocument) {
    super(printer?._id);
    if (printer) {
      this.serialNumber = printer.serialNumber;
      this.product = printer.product;
    }
  }
}