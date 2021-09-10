import * as bcrypt from 'bcrypt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserCredentialsDto, UserDto } from '../users/users.dto';
import { AccessTokenPayload, RefreshTokenPayload } from './interfaces/jwt.payload';
import { ActiveStatus } from '../commons/enum/enums';
import { RefreshToken, RefreshTokenDocument } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  refreshTokenExpiresIn: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken.name) private readonly model: Model<RefreshTokenDocument>
  ) {
    this.refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  async login(userCredentials: UserCredentialsDto): Promise<any> {
    this.logger.log(`> validateUser -  Trying to login the user: ${userCredentials.username}`);

    const user = await this.usersService.findOne({ username : userCredentials.username || ''});
    
    if (!user) {
      const error = { username: 'error.user.not.found' }
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }

    if (user.status !== ActiveStatus.Active) {
      const error = { username: 'error.user.inactive' }
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }

    if (bcrypt.compareSync(userCredentials.password, user.password)) {
      return  { user, accessToken : await this.generateAccessToken(user) };
    }

    const error = { password: 'error.user.password.invalid' }
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }

  async validatePayload(payload: AccessTokenPayload): Promise<Partial<UserDto>> {
    this.logger.log(`> validatePayload -  Trying to login the user: ${JSON.stringify(payload)}`);
    const user = await this.usersService.findOne({ email : payload.email });
    
    if (!user) {
      const error = { username: 'error.user.not.found' }
      this.logger.error(error);
      throw new UnauthorizedException(error);

    }
    return { 
      _id: user._id,
      username: user.username,
      email:user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      changePassword: user.changePassword
    };
  }

  async createRefreshToken (user: UserDto): Promise<RefreshTokenDocument> {
    const token = new this.model();
    token.userId = user._id;
    token.isRevoked = false;
    
    const expiration = new Date()
    expiration.setTime(expiration.getTime() + ms(this.refreshTokenExpiresIn));
    
    token.expires = expiration;

    return token.save();
  }

  async findRefreshTokenById(id: string): Promise<RefreshTokenDocument> {
    return this.model.findById(id).exec();
  }

  public async generateAccessToken (user: UserDto): Promise<any> {
      const payload: AccessTokenPayload = { 
        _id: user._id,
        username: user.username,
        email:user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
        changePassword: user.changePassword
      };

      this.logger.log(`< validateUser - ${user.username} OK`);
      
      return this.jwtService.sign(payload);
  }

  public async generateRefreshToken(user: UserDto): Promise<string> {
    const token: RefreshTokenDocument = await this.createRefreshToken(user)

    const opts: JwtSignOptions = {
      expiresIn: this.refreshTokenExpiresIn,
      subject: user._id.toString(),
      jwtid: token._id.toString(),
    }

    return this.jwtService.signAsync({}, opts);
  }

  public async resolveRefreshToken (encoded: string): Promise<{ user: UserDto, token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded)
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found')
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked')
    }

    const user = await this.getUserFromRefreshTokenPayload(payload)

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return { user, token }
  }

  public async refreshToken(refresh: string): Promise<{ token: string, user: UserDto }> {
    const { user } = await this.resolveRefreshToken(refresh)

    return await this.generateAccessToken(user);  
  }

  private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired')
      } else {
        throw new UnprocessableEntityException('Refresh token malformed') 
      }
    }
  }

  private async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<UserDto> {
    const subId = payload.sub

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.usersService.findById(subId)
  }

  private async getStoredTokenFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<RefreshToken | null> {
    const tokenId = payload.jti

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.findRefreshTokenById(tokenId)
  }
}
