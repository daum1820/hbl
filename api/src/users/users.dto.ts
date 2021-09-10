import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActiveStatus, Role } from '../commons/enum/enums';
import { BaseIdDto } from '../base/base.dto';
import { UserDocument } from './users.schema';
export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;
  
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class UserSecurityDto {
  @IsString()
  @IsOptional()
  public password?: string;

  @IsBoolean()
  @IsOptional()
  public changePassword?: boolean;

  @IsEnum(Role, { each : true })
  @IsOptional()
  public role?: Role;

  @IsEnum(ActiveStatus, { each : true })
  @IsOptional()
  public status?: ActiveStatus;
}
export class UserDto extends BaseIdDto {
  
  username: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  name?: string | undefined;
	lastName?: string | undefined;
  dateOfBirth?: Date | undefined;
  phone?: string | undefined;
  role?: Role | undefined;
  address?: string | undefined;
  county?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  zipcode?: string | undefined;
  position?: string | undefined;
  changePassword?: boolean | undefined;
  status: ActiveStatus;

  constructor(user?: UserDocument) {
    super(user?._id);
    
    if (user) {
      this.username = user.username;
      this.name = user.name;
      this.lastName = user.lastName;
      this.dateOfBirth = user.dateOfBirth;
      this.email = user.email;
      this.phone = user.phone;
      this.role = user.role;
      this.address = user.address;
      this.county = user.county;
      this.city = user.city;
      this.state = user.state;
      this.zipcode = user.zipcode;
      this.position = user.position;
      this.status = user.status;
      this.changePassword = user.changePassword;
    }
  }
}