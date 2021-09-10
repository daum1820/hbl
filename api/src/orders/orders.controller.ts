import { Body, Controller, Delete, Get, Header, InternalServerErrorException, Logger, Param, Post, Put, Query, Req, Res, Response } from '@nestjs/common';
import { BaseQueryDto, BasePaginationDto } from '../base/base.dto';
import { reduceModel } from '../utils';
import { Public } from '../commons/decorators/public.decorator';
import { Roles } from '../commons/decorators/roles.decorator';
import { Role } from '../commons/enum/enums';
import { OrderDto, OrderStatusDto } from './orders.dto';
import { OrderDocument } from './orders.schema';
import { OrdersService } from './orders.service';


@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    

    const customers: OrderDocument[] = await this.ordersService.findAll(filter, limit, page, sort);
    const count = await this.ordersService.count(filter);
    
    const result = {
      count,
      items : customers.map(c=> new OrderDto(c)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${customers.length}`);
    return result;
  }

  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.ordersService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }

  @Get(':id')
  async readOne(@Param('id') id: string): Promise<OrderDto> {
    this.logger.log(`> readOne - ${id}`);
    const order: OrderDocument = await this.ordersService.findById(id);

    if(!order) {
      const message = `Order with id '${id}' could not be found.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< readOne - result: ${JSON.stringify(order)}`);
    return new OrderDto(order);
  }

  @Roles(Role.Admin, Role.Moderator)
  @Post('create')
  async create(@Body() orderDto: OrderDto, @Req() req): Promise<OrderDto> {
    this.logger.log(`> create - ${JSON.stringify(orderDto)}`);

    const createdOrder: OrderDocument = await this.ordersService.create(orderDto, req.user);

    this.logger.log(`< create - result: ${JSON.stringify(createdOrder)}`);

    return this.readOne(createdOrder._id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderDto: OrderDto, @Req() req): Promise<OrderDto> {
    const { _id, ...toUpdateDto } = orderDto;

    this.logger.log(`> update - ${JSON.stringify(orderDto)} for id ${id}`);

    const existsOrder = await this.ordersService.findOne({ _id: id });

    if (!existsOrder) {
      const message = `Order with id '${id}' not exists.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    const updatedOrder: OrderDocument = await this.ordersService.update(id, toUpdateDto, req.user);

    this.logger.log(`< update - result: ${JSON.stringify(updatedOrder)}`);
    return this.readOne(id);
  }

  @Post(':id/assign')
  async assign(@Param('id') id: string, @Req() req): Promise<OrderDto> {
    
    this.logger.log(`> assignToMe - ${JSON.stringify(req.user)} for id ${id}`);

    const existsOrder = await this.ordersService.findOne({ _id: id });

    if (!existsOrder) {
      const message = `Order with id '${id}' not exists.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    existsOrder.technicalUser = req.user._id;

    const updatedOrder: OrderDocument = await this.ordersService.update(id, existsOrder, req.user);

    this.logger.log(`< update - result: ${JSON.stringify(updatedOrder)}`);
    return this.readOne(id);
  }

  @Roles(Role.Admin, Role.Moderator)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<OrderDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.ordersService.deleteById(id);

    if (!result) {
      const message = `Order with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new OrderDto(result);
    
  }

  @Put(':id/changeStatus')
  async changeStatus(@Param('id') id: string, @Body() statusDto: OrderStatusDto, @Req() req): Promise<OrderDto> {
    this.logger.log(`> changeStatus - ${id}`);
    const result = await this.ordersService.changeStatus(id, statusDto.status, req.user);

    if (!result) {
      const message = `Order's status with id '${id}' could not be updated.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< changeStatus - result: ${JSON.stringify(result)}`);
    return this.readOne(id);
    
  }

  @Public()
  @Get('/:id/export')
	@Header('Content-type', 'application/pdf')
	async exportOrder(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`> export PDF for order id ${id}`);

		const pdfFile = await this.ordersService.export(id);
    pdfFile.pipe(res);
    
	}
}
