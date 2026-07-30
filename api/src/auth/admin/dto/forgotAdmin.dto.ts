import { IsEmail, IsString } from 'class-validator';

export class ForgotAdmin {
  @IsEmail()
  @IsString()
  email!: string;
}
