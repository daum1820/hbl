import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { PrinterDto } from '../printers/printers.dto';
import { Roles } from '../commons/decorators/roles.decorator';
import { Role } from '../commons/enum/enums';
import { CustomerDto } from './customers.dto';
import { CustomerDocument } from './customers.schema';
import { CustomersService } from './customers.service';
import { BasePaginationDto, BaseQueryDto, ChangeStatusDto, PincodeDto } from '../base/base.dto';
import { reduceModel } from '../utils';
import { PrinterDocument } from '../printers/printers.schema';


@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;

    const customers: CustomerDocument[] = await this.customersService.findAll(filter, limit, page, sort);
    const count = await this.customersService.count(filter);
    
    const result = {
      count,
      items : customers.map(c=> new CustomerDto(c)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${customers.length}`);
    return result;
  }

  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.customersService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }


  @Get(':id')
  async readOne(@Param('id') id: string): Promise<CustomerDto> {
    this.logger.log(`> readOne - ${id}`);
    const customer: CustomerDocument = await this.customersService.findById(id);

    if(!customer) {
      const message = `Customer with id '${id}' could not be found.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< readOne - result: ${JSON.stringify(customer)}`);
    return new CustomerDto(customer);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() customerDto: CustomerDto): Promise<CustomerDto> {
    this.logger.log(`> create - ${JSON.stringify(customerDto)}`);

    const existsCustomer = await this.customersService.exists({ registrationNr: customerDto.registrationNr });
    if (!!existsCustomer) {
      const error = {
        registrationNr: 'error.customer.registrationNr.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const createdCustomer: CustomerDocument = await this.customersService.create(customerDto);

    this.logger.log(`< create - result: ${JSON.stringify(createdCustomer)}`);

    return this.readOne(createdCustomer._id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() customerDto: CustomerDto): Promise<CustomerDto> {
    const { _id, ...toUpdateDto } = customerDto;

    this.logger.log(`> update - ${JSON.stringify(customerDto)} for id ${id}`);
    
    const existsCustomer = await this.customersService.exists({ _id : { $ne: id },  registrationNr: customerDto.registrationNr });
    if (!!existsCustomer) {
      const error = {
        registrationNr: 'error.customer.registrationNr.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const updatedCustomer: CustomerDocument = await this.customersService.update(id, toUpdateDto);

    this.logger.log(`< update - result: ${JSON.stringify(updatedCustomer)}`);
    return this.readOne(id);
  }

  @Put(':id/changeStatus')
  async changeStatus(@Param('id') id: string, @Body() changeStatusDto: ChangeStatusDto): Promise<CustomerDto> {

    this.logger.log(`> changeStatus - Customer id ${id}`);

    const existsCustomer = await this.customersService.findById(id);

    if (!existsCustomer) {
      const error = {
        key: 'error.customer.not.found'
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    
    const updatedCustomer: CustomerDocument = await this.customersService.update(id, changeStatusDto);

    this.logger.log(`< changeSecurity - result: ${JSON.stringify(updatedCustomer)}`);
    return this.readOne(id);
  }


  @Put(':id/pincode')
  async pincode(@Param('id') id: string): Promise<CustomerDto> {

    this.logger.log(`> pincode - Customer id ${id}`);

    const existsCustomer = await this.customersService.findById(id);

    if (!existsCustomer) {
      const error = {
        key: 'error.customer.not.found'
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    
    const updatedCustomer: CustomerDocument = await this.customersService.pincode(id);

    this.logger.log(`< changeSecurity - result: ${JSON.stringify(updatedCustomer)}`);
    return this.readOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CustomerDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.customersService.deleteById(id);

    if (!result) {
      const message = `Customer with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new CustomerDto(result);
    
  }

  @Roles(Role.Admin)
  @Post(':id/printer')
  async addPrinter(@Param('id') id: string, @Body() printer: PrinterDto): Promise<PrinterDto> {

    this.logger.log(`> addPrinter - ${JSON.stringify(printer)} for customer id ${id}`);

    const filterSerialNumber = { _id: id, 'printers.serialNumber' : printer.serialNumber };

    const customerWithPrinter = await this.customersService.findOne(filterSerialNumber);
    if (customerWithPrinter) {
      const error = {
        serialNumber: 'error.serialNumber.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const newPrinter: PrinterDocument = await this.customersService.addPrinter(id, printer);

    this.logger.log(`< addPrinter - result: ${JSON.stringify(newPrinter)}`);
    return new PrinterDto(newPrinter);
  }

  @Roles(Role.Admin)
  @Delete(':id/printer')
  async removePrinter(@Param('id') id: string, @Body() printer: Partial<PrinterDto>): Promise<CustomerDto> {

    this.logger.log(`> removePrinter - ${JSON.stringify(printer)} for customer id ${id}`);

    const filterSerialNumber = { _id: id, 'printers._id' : printer._id };

    const customerWithPrinter = await this.customersService.findOne(filterSerialNumber);
    this.logger.debug(customerWithPrinter);
    if (!customerWithPrinter) {
      const message = `Printer with Serial Number or id '${printer.serialNumber || printer._id}' for Customer with id '${id}' not exists.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    const updatedCustomer: CustomerDocument = await this.customersService.removePrinter(id, printer);

    this.logger.log(`< removePrinter - result: ${JSON.stringify(updatedCustomer)}`);
    return this.readOne(id);
  }
}
