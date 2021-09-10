import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './users.schema';
import { UserDto, UserSecurityDto } from './users.dto';
import { BaseFieldsDto, BaseQueryDto } from '../base/base.dto';
import { buildFilter } from '../utils';

@Injectable()
export class UsersService {

  fields: BaseFieldsDto[] = [
    {fieldName: 'username', fieldType : 'string'},
    {fieldName: 'email', fieldType : 'string'},
    {fieldName: 'name', fieldType : 'string'},
    {fieldName: 'lastName', fieldType : 'string'}
  ];

  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async create(newUser: Partial<UserDto>): Promise<UserDocument> {
    newUser.password = bcrypt.hashSync(newUser.password, 8);

    const createdUsed = new this.model(newUser);
    return createdUsed.save();
  }

  async update(id: string, user: Partial<UserDto>): Promise<UserDocument> {
    return this.model.findByIdAndUpdate(id, user).exec();
  }

  async updateSecurity(id: string, security: Partial<UserSecurityDto>): Promise<UserDocument> {
    if (!!security.password) {
      security.password = bcrypt.hashSync(security.password, 8);
    }
    return  this.model.findByIdAndUpdate(id, { ...security }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.model.findById(id).exec();
  }

  async count(filter: BaseQueryDto = {}): Promise<number> {
    return this.model.count(buildFilter(filter, this.fields)).exec();
  }

  async findAll(filter: BaseQueryDto = {}, limit: number = 5, pageNumber: number = 0, sort: any = { name: 'asc'}): Promise<UserDocument[]> {
    return this.model.find(buildFilter(filter, this.fields))
      .limit(Number(limit))
      .skip(Number(pageNumber) * Number(limit))
      .sort(typeof sort == 'string' ? JSON.parse(sort) : sort)
      .exec();
  }

  async findOne(filter: any): Promise<UserDocument | undefined> {
    return this.model.findOne(filter).exec();
  }

  async exists(filter: any): Promise<boolean | undefined> {
    return this.model.exists(filter);
  }

  async deleteById(id: string): Promise<UserDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

}

