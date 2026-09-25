import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^[0-9+]{10,15}$/, {
    message: 'Phone number must be valid format with 10 to 15 digits',
  })
  phone: string;
}
