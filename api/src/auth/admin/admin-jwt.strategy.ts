import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface AdminJwtPayload {
  data: {
    sub: string;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
  };
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor() {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('ADMIN_JWT_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AdminJwtPayload) {
    if (
      payload.data?.roles?.includes('admin') ||
      payload.data?.roles?.includes('executer') ||
      payload.data?.roles?.includes('superadmin')
    ) {
      return payload.data;
    }
    throw new UnauthorizedException('You do not have admin privileges');
  }
}
