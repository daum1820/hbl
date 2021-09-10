import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { BasePaginationDto, BaseQueryDto } from '../base/base.dto';
import { reduceModel } from '../utils';
import { Roles } from '../commons/decorators/roles.decorator';
import { ProductTypes, Role } from '../commons/enum/enums';
import { ProductDto } from './products.dto';
import { ProductDocument } from './products.schema';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController  {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;

    const products: ProductDocument[] = await this.productsService.findAll(filter, limit, page, sort);
    const count = await this.productsService.count(filter);
    
    const result = {
      count,
      items : products.map(p => new ProductDto(p)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${products.length}`);
    return result;
  }

  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.productsService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }

  @Get(':id')
  async readOne(@Param('id') id: string): Promise<ProductDto> {
    this.logger.log(`> readOne - ${id}`);
    const product: ProductDocument = await this.productsService.findById(id);

    if(!product) {
      const message = `Product with id '${id}' could not be found.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< readOne - result: ${JSON.stringify(product)}`);
    return new ProductDto(product);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() productDto: ProductDto): Promise<ProductDto> {
    this.logger.log(`> create - ${JSON.stringify(productDto)}`);

    const existsModelBrandProduct = await this.productsService.exists({ model: productDto.model, brand: productDto.brand });
    if (!!existsModelBrandProduct && productDto.type === ProductTypes.Printer) {
      const error = {
        model: 'error.model.brand.exists',
        brand: 'error.model.brand.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    
    const existsModelTypeProduct = await this.productsService.exists({ model: productDto.model, type: productDto.type });
    if (!!existsModelTypeProduct && productDto.type === ProductTypes.Service) {
      const error = {
        model: 'error.model.type.exists',
        type: 'error.model.type.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    

    const createdProduct: ProductDocument = await this.productsService.create(productDto);

    this.logger.log(`< create - result: ${JSON.stringify(createdProduct)}`);

    return new ProductDto(createdProduct);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() productDto: ProductDto): Promise<ProductDto> {
    const { _id, ...toUpdateDto } = productDto;

    this.logger.log(`> update - ${JSON.stringify(productDto)} for id ${id}`);

    const filterModel = { _id : { $ne: id }, model: productDto.model, brand: productDto.brand };
    const existsModelProduct = await this.productsService.exists(filterModel);
    if (!!existsModelProduct) {
      const error = {
        model: 'error.model.brand.type.exists',
        productBrand: 'error.model.brand.type.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const updatedProduct: ProductDocument = await this.productsService.update(id, toUpdateDto);

    this.logger.log(`< update - result: ${JSON.stringify(updatedProduct)}`);
    return new ProductDto(updatedProduct);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ProductDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.productsService.deleteById(id);

    if (!result) {
      const message = `Product with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new ProductDto(result);
    
  }
}
