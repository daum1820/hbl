import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../../commons/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.logger.log(`> canActivate - Checking Public scope...`);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // method is Public, no further check is need.
    if (isPublic) {
      this.logger.log(`< canActivate - ...Method is public`);
      return true;
    }
    
    this.logger.log(`canActivate -...Method is not public`);

    return super.canActivate(context);   
  }

  handleRequest(err, user, info) {

    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
