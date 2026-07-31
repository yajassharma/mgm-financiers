import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthService {
  constructor(private readonly users: UsersService) {}

  async login({ email, password }: { email: string; password: string }) {
    const user: any = await this.users.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

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
