import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { Role } from '../commons/enum/enums';
import { Roles } from '../commons/decorators/roles.decorator';
import { CategoriesDto } from './categories.dto';
import { CategoriesDocument } from './categories.schema';
import { CategoriesService } from './categories.service';
import { BasePaginationDto, BaseQueryDto } from '../base/base.dto';
import { reduceModel } from '../utils';

@Controller('categories')
export class CategoriesController  {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;

    const categories: CategoriesDocument[] = await this.categoriesService.findAll(filter, limit, page, sort);
    const count = await this.categoriesService.count(filter);
    
    const result = {
      count,
      items : categories.map(c => new CategoriesDto(c)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${categories.length}`);
    return result;
  }

  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.categoriesService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }
    
  @Get(':id')
  async readOne(@Param('id') id: string): Promise<CategoriesDto> {
    this.logger.log(`> readOne - ${id}`);
    const category: CategoriesDocument = await this.categoriesService.findById(id);

    if(!category) {
      const message = `Category with id '${id}' could not be found.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< readOne - result: ${JSON.stringify(category)}`);
    return new CategoriesDto(category);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() categoryDto: CategoriesDto): Promise<CategoriesDto> {
    this.logger.log(`> create - ${JSON.stringify(categoryDto)}`);

    const existsCategory = await this.categoriesService.exists({ name: categoryDto.name, type: categoryDto.type });
    if (!!existsCategory) {
      const error = {
        name: 'error.category.name.type.exists',
        type: 'error.category.name.type.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const createdCategory: CategoriesDocument = await this.categoriesService.create(categoryDto);

    this.logger.log(`< create - result: ${JSON.stringify(createdCategory)}`);

    return this.readOne(createdCategory._id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() categoryDto: CategoriesDto): Promise<CategoriesDto> {
    const { _id, ...toUpdateDto } = categoryDto;

    this.logger.log(`> update - ${JSON.stringify(categoryDto)} for id ${id}`);
    const filterUser = { _id : { $ne: id },  name: categoryDto.name, type: categoryDto.type };
    const existsCategory = await this.categoriesService.exists(filterUser);
    if (!!existsCategory) {
      const error = {
        name: 'error.category.name.type.exists',
        type: 'error.category.name.type.exists',
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }

    const updatedCategory: CategoriesDocument = await this.categoriesService.update(id, toUpdateDto);

    this.logger.log(`< update - result: ${JSON.stringify(updatedCategory)}`);
    return this.readOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CategoriesDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.categoriesService.deleteById(id);

    if (!result) {
      const message = `Category with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new CategoriesDto(result);
    
  }
}
