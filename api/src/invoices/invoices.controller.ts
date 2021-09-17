import { Body, Controller, Delete, Get, Header, InternalServerErrorException, Logger, Param, Post, Put, Query, Req, Res, Response } from '@nestjs/common';
import { BasePaginationDto, BaseQueryDto } from '../base/base.dto';
import { reduceModel } from '../utils';
import { Public } from '../commons/decorators/public.decorator';
import { Roles } from '../commons/decorators/roles.decorator';
import { InvoiceStatus, Role } from '../commons/enum/enums';
import { InvoiceDto, InvoiceItemDto, InvoiceStatusDto } from './invoices.dto';
import { InvoiceDocument } from './invoices.schema';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  private readonly logger = new Logger(InvoicesController.name);

  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;

    const customers: InvoiceDocument[] = await this.invoicesService.findAll(filter, limit, page, sort);
    const count = await this.invoicesService.count(filter);
    const amount = await this.invoicesService.amount(filter);
    
    const result = {
      amount,
      count,
      items : customers.map(c=> new InvoiceDto(c)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${customers.length}`);
    return result;
  }

  @Get('amount')
  async amount(@Query() query): Promise<number> {
    this.logger.log(`> amount `);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.invoicesService.amount(filter);

    this.logger.log(`< amount: ${count}`);

    return count;
  }

  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.invoicesService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }

  @Get(':id')
  async readOne(@Param('id') id: string): Promise<InvoiceDto> {
    this.logger.log(`> readOne - ${id}`);
    const invoice: InvoiceDocument = await this.invoicesService.findById(id);

    if(!invoice) {
      const message = `Invoice with id '${id}' could not be found.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< readOne - result: ${JSON.stringify(invoice)}`);
    return new InvoiceDto(invoice);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() invoiceDto: InvoiceDto, @Req() req): Promise<InvoiceDto> {
    this.logger.log(`> create - ${JSON.stringify(invoiceDto)}`);
    
    const {items, ...restDto} = invoiceDto;
    const createdInvoice: InvoiceDocument = await this.invoicesService.create(restDto, req.user);

    this.logger.log(`< create - result: ${JSON.stringify(createdInvoice)}`);
    return this.readOne(createdInvoice._id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() invoiceDto: InvoiceDto, @Req() req): Promise<InvoiceDto> {
    const { _id, items, ...toUpdateDto } = invoiceDto;

    this.logger.log(`> update - ${JSON.stringify(invoiceDto)} for id ${id}`);

    const existsInvoice = await this.invoicesService.findOne({ _id: id, status: InvoiceStatus.Open });

    if (!existsInvoice) {
      const message = `Invoice with id '${id}' not exists or the status is not open.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }
    
    const updatedInvoice: InvoiceDocument = await this.invoicesService.update(id, toUpdateDto, req.user);

    this.logger.log(`< update - result: ${JSON.stringify(updatedInvoice)}`);
    return this.readOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InvoiceDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.invoicesService.deleteById(id);

    if (!result) {
      const message = `Invoice with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new InvoiceDto(result);
    
  }

  @Roles(Role.Admin)
  @Put(':id/changeStatus')
  async changeStatus(@Param('id') id: string, @Body() statusDto: InvoiceStatusDto, @Req() req): Promise<InvoiceDto> {
    this.logger.log(`> changeStatus - ${id}`);
    const result = await this.invoicesService.changeStatus(id, statusDto.status, req.user);

    if (!result) {
      const message = `Invoice's status with id '${id}' could not be closed.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< changeStatus - result: ${JSON.stringify(result)}`);
    return this.readOne(id);
    
  }

  @Roles(Role.Admin)
  @Post(':id/item')
  async addItem(@Param('id') id: string, @Body() invoiceItem: InvoiceItemDto, @Req() req): Promise<InvoiceDto> {

    this.logger.log(`> addItem - ${JSON.stringify(invoiceItem)} for invoice id ${id}`);

    const invoiceExists = await this.invoicesService.findOne({ _id: id, status: InvoiceStatus.Open });
    if (!invoiceExists) {
      const message = `Invoice with id '${id}' not exists or the status is not open.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    const updatedInvoice: InvoiceDocument = await this.invoicesService.addItem(id, invoiceItem, req.user);

    this.logger.log(`< addItem - result: ${JSON.stringify(updatedInvoice)}`);
    return this.readOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id/item')
  async removeItem(@Param('id') id: string, @Body() invoiceItem: InvoiceItemDto, @Req() req): Promise<InvoiceDto> {

    this.logger.log(`> removeItem - ${JSON.stringify(invoiceItem)} for invoice id ${id}`);

    const filterInvoice = { _id: id, status: InvoiceStatus.Open, 'items._id' : invoiceItem._id };

    const invoiceWithInvoiceItem = await this.invoicesService.findOne(filterInvoice);
    if (!invoiceWithInvoiceItem) {
      const message = `InvoiceItem with id '${invoiceItem._id}' for Invoice with id '${id}' not exists  or the status is not open.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    const updatedInvoice: InvoiceDocument = await this.invoicesService.removeItem(id, invoiceItem, req.user);

    this.logger.log(`< removeItem - result: ${JSON.stringify(updatedInvoice)}`);
    return this.readOne(id);
  }

  @Public()
  @Get('/:id/export')
	@Header('Content-type', 'application/pdf')
	async exportInvoice(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`> export PDF for invoice id ${id}`);

		const pdfFile = await this.invoicesService.export(id);
    pdfFile.pipe(res);
    
	}
}
