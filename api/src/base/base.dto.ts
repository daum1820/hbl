import { IsString, IsOptional } from 'class-validator';
import { ActiveStatus } from '../commons/enum/enums';

export class BaseIdDto {
  @IsOptional()
  @IsString()
  public _id?: string | undefined;

  constructor(id: string | undefined) {
    this._id = id;
  }
}

export interface BasePaginationDto {
  count?: number,
  items: any
}

export interface BaseQueryDto {
  search?: any,
  limit?: number,
  page?: number,
  sort?: any,
}

export interface BaseFieldsDto {
  fieldName: string,
  fieldType: string
}

export interface ChangeStatusDto {
  status: ActiveStatus;
}