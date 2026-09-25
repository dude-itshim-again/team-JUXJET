import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../../common/enums';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @IsString()
  @Length(4, 6, { message: 'OTP must be between 4 and 6 characters' })
  otp: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be one of CITIZEN, STAFF, ADMIN' })
  role?: Role;
}
