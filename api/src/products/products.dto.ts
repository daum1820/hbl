import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Categories } from '../categories/categories.schema';
import { BaseIdDto } from '../base/base.dto';

import { ProductDocument } from './products.schema';
import { ProductTypes } from '../commons/enum/enums';
export class ProductDto extends BaseIdDto {

  @IsOptional()
  @IsString()
  public model: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsEnum(ProductTypes, { each : true })
  @IsOptional()
  public type: ProductTypes;
  
  public brand: Categories;

  constructor(product?: ProductDocument) {
    super(product?._id);

    if (product) {
      this.model = product.model;
      this.description = product.description;
      this.type = product.type;
      this.brand = product.brand;
    }
  }
}