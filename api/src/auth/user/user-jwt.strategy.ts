import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface UserJwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor() {
    const secret = process.env.USER_JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('USER_JWT_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserJwtPayload) {
    if (!payload?.roles?.includes('user')) {
      throw new UnauthorizedException('You do not have user privileges');
    }
    return payload; // This will attach payload to request.user
  }
}
