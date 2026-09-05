import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as jwt from 'jsonwebtoken';

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

@Injectable()
export class UserAuthService {
  constructor(private readonly users: UsersService) {}

  async login({ email, password }: { email: string; password: string }) {
    const key = email.toLowerCase().trim();
    const now = Date.now();
    const record = loginAttempts.get(key);

    if (record && record.lockedUntil > now) {
      const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
      throw new HttpException(
        `Account locked. Try again in ${remainingSec} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user: any = await this.users.validateUser(email, password);
    if (!user) {
      const attempts = (record?.count || 0) + 1;
      const lockedUntil = attempts >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0;
      loginAttempts.set(key, { count: attempts, lockedUntil });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clear attempts on successful login
    loginAttempts.delete(key);

    const expiresIn: any = process.env.JWT_EXPIRES_IN || '1h';

    const secret = process.env.USER_JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT secret not set');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };

    const accessToken = jwt.sign(
      {
        data: payload,
      },
      secret,

      { expiresIn: expiresIn },
    );

    return { title: 'Login', message: 'User logged in', data: { accessToken } };
  }
}
