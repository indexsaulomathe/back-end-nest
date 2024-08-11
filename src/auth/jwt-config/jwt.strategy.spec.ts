import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth.module';
import { FindOneUserService } from '../../users/find-one-user/find-one-user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly findOneUserService: FindOneUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: {
    id: number;
    email: string;
    roles: string[];
    blocked: boolean;
  }) {
    const user = await this.findOneUserService.findOne(payload.id);

    if (!user) {
      this.logger.error(`User not found with id: ${payload.id}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.blocked) {
      this.logger.warn(`Blocked user attempted access: ${user.email}`);
      throw new UnauthorizedException('User is blocked');
    }

    if (user.email !== payload.email) {
      this.logger.error(
        `Email mismatch: expected ${payload.email}, but found ${user.email}`,
      );
      throw new UnauthorizedException('Email does not match');
    }

    return { id: user.id, email: user.email, roles: user.roles };
  }
}
