import { IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  wallet_address: string;
}
