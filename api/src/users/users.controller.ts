import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { BasePaginationDto, BaseQueryDto } from '../base/base.dto';
import { reduceModel } from '../utils';
import { Roles } from '../commons/decorators/roles.decorator';
import { Role } from '../commons/enum/enums';
import { UserDto, UserSecurityDto } from './users.dto';
import { UserDocument } from './users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService){}


  @Roles(Role.Admin, Role.Moderator)
  @Get()
  async read(@Query() query: BaseQueryDto): Promise<BasePaginationDto> {
    this.logger.log(`> read - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const users: UserDocument[] = await this.usersService.findAll(filter, limit, page, sort);
    const count = await this.usersService.count(filter);
  
    const result = {
      count,
      items : users.map(u => new UserDto(u)).reduce(reduceModel(), {})
    }

    this.logger.log(`< read - count: ${users.length}`);
    return result;
  }

  
  @Roles(Role.Admin, Role.Moderator)
  @Get('count')
  async count(@Query() query): Promise<number> {
    this.logger.log(`> count - ${JSON.stringify(query)}`);
    const { limit, page, sort, ...filter } = query;
    const count: number = await this.usersService.count(filter);

    this.logger.log(`< count: ${count}`);

    return count;
  }
    
  @Get('profile')
  async getProfile(@Req() req) {
    const { user: { username } } = req;
    this.logger.log(`> profile - ${username}`);
    
    const user: UserDocument = await this.usersService.findOne({ username });

    this.logger.log(`< profile - ${JSON.stringify(user)}`);

    return new UserDto(user);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async readOne(@Param('id') id: string): Promise<UserDto> {
    this.logger.log(`> readOne - ${id}`);
    const user: UserDocument = await this.usersService.findById(id);
    if (!user) {
      const error = {
        key: 'error.user.not.found'
      }
      this.logger.error(`< readOne - No user was found with id: ${id}`);
      throw new InternalServerErrorException(error);
    }

    this.logger.log(`< readOne: ${JSON.stringify(user)}`);
    return new UserDto(user);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() userDto: UserDto): Promise<UserDto> {
    this.logger.log(`> create - ${JSON.stringify(userDto)}`);

    const filterUser = { $or: [{username: userDto.username }, { email: userDto.email }]};
    const existsUser = await this.usersService.findOne(filterUser);

    if (!!existsUser) {
      const error = {
        username: existsUser.username === userDto.username ? 'error.user.already.exists' : null,
        email: existsUser.email === userDto.email ? 'error.email.already.exists' : null,
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    

    const newUserDto: UserDocument = await this.usersService.create(userDto);

    this.logger.log(`< create - user with ${newUserDto._id} created`);
    return new UserDto(newUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto): Promise<UserDto> {
    const { _id, password, ...toUpdateDto } = userDto;

    this.logger.log(`> update - ${JSON.stringify(userDto)} for id ${id}`);

    const filterUser = { _id : { $ne: id }, $or: [{username: userDto.username }, { email: userDto.email }]};
    const existsUser = await this.usersService.findOne(filterUser);

    if (!!existsUser) {
      const error = {
        username: existsUser.username === userDto.username ? 'error.user.already.exists' : null,
        email: existsUser.email === userDto.email ? 'error.email.already.exists' : null,
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    
    const updatedUser: UserDocument = await this.usersService.update(id, toUpdateDto);

    this.logger.log(`< update - result: ${JSON.stringify(updatedUser)}`);
    return new UserDto(updatedUser);
  }

  @Put(':id/changeSecurity')
  async changeSecurity(@Param('id') id: string, @Body() userSecurityDto: UserSecurityDto): Promise<UserDto> {

    this.logger.log(`> changeSecurity - User id ${id}`);

    const existsUser = await this.usersService.findById(id);

    if (!existsUser) {
      const error = {
        key: 'error.user.not.found'
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
    
    const updatedUser: UserDocument = await this.usersService.updateSecurity(id, userSecurityDto);

    this.logger.log(`< changeSecurity - result: ${JSON.stringify(updatedUser)}`);
    return new UserDto(updatedUser);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserDto> {
    this.logger.log(`> delete - ${id}`);
    const result = await this.usersService.deleteById(id);

    if (!result) {
      const message = `User with id '${id}' could not be deleted.`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    this.logger.log(`< delete - result: ${JSON.stringify(result)}`);
    return new UserDto(result);
    
  }
}

