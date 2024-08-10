import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth.module';
import { FindOneUserService } from '../../users/find-one-user/find-one-user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private findOneUserService: FindOneUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number }) {
    try {
      const user = await this.findOneUserService.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating JWT token: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
