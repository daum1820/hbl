// eslint-disable-next-line prettier/prettier
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Public } from '../commons/decorators/public.decorator';
import { UserCredentialsDto } from '../users/users.dto';
import { AuthService } from './auth.service';
import { RefreshTokenRequest } from './interfaces/jwt.payload';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userCredentials: UserCredentialsDto) {
    this.logger.log(`> login - ${userCredentials.username}`);
    const {user, accessToken } = await this.authService.login(userCredentials);
    const refreshToken = await this.authService.generateRefreshToken(user);
    this.logger.log(`< login - ${JSON.stringify(accessToken)}`);
    return  { accessToken, refreshToken };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshTokenRequest: RefreshTokenRequest) {
    this.logger.log(`> refreshToken - ${refreshTokenRequest.refreshToken}`);
    const accessToken = await this.authService.refreshToken(refreshTokenRequest.refreshToken);
    this.logger.log(`< refreshToken - ${JSON.stringify(accessToken)}`);
    return { accessToken };
  }

  @Public()
  @Post('health_check')
  async healthCheck() {
    return "OK";
  }
}
