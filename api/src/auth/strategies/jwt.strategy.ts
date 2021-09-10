import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AccessTokenPayload> {
    this.logger.log(`validate JWT payload`);
    const user = await this.authService.validatePayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
