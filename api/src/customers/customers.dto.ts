import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BaseIdDto } from '../base/base.dto';

import { CustomerDocument } from './customers.schema';
import { ActiveStatus } from '../commons/enum/enums';
import { PrinterDto } from '../printers/printers.dto';
import { reduceModel } from '../utils';

export class CustomerDto extends BaseIdDto {

  @IsNumber()
  @IsOptional()
  public customerNumber: number;

  @IsString()
  public name: string;

  @IsString()
  public fullName: string;

  @IsEnum(ActiveStatus, { each : true })
  public status: ActiveStatus;

  @IsOptional()
  @IsString()
  public registrationNr: string;

  @IsOptional()
  @IsString()
  public address: string;

  @IsOptional()
  @IsString()
  public city: string;

  @IsOptional()
  @IsString()
  public state: string;

  @IsOptional()
  @IsString()
  public zipcode: string;

  @IsOptional()
  @IsString()
  public contactName: string;

  @IsOptional()
  @IsString()
  public contactPhone: string;

  @IsOptional()
  @IsString()
  public contactEmail: string;

  @IsOptional()
  public printers: {};


  constructor(customer?: CustomerDocument) {
    super(customer?._id);

    if (customer) {
      this.customerNumber = customer.customerNumber;
      this.name = customer.name;
      this.fullName = customer.fullName;
      this.registrationNr = customer.registrationNr;
      this.address = customer.address;
      this.city = customer.city;
      this.state = customer.state;
      this.zipcode = customer.zipcode;
      this.contactName = customer.contactName;
      this.contactEmail = customer.contactEmail;
      this.contactPhone = customer.contactPhone;
      this.printers = customer.printers.reduce(reduceModel(), {});
      this.status = customer.status;
    }
  }
}