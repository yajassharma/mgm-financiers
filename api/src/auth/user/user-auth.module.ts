import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { UserJwtStrategy } from './user-jwt.strategy';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [UserAuthController],
  providers: [UserAuthService, UserJwtStrategy],
})
export class UserAuthModule {}
