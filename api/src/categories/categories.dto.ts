import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CategoryTypes } from '../commons/enum/enums';
import { BaseIdDto } from '../base/base.dto';

import { CategoriesDocument } from './categories.schema';
export class CategoriesDto extends BaseIdDto {

  @IsOptional()
  @IsString()
  public name: string;

  @IsEnum(CategoryTypes, { each : true })
  @IsOptional()
  public type: CategoryTypes;

  constructor(category?: CategoriesDocument) {
    super(category?._id);

    if (category) {
      this.name = category.name;
      this.type = category.type;
    }
  }
}