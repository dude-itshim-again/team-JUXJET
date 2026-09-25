import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Department name is required' })
  @IsString()
  @MinLength(3, { message: 'Department name must be at least 3 characters' })
  name: string;

  @IsNotEmpty({ message: 'Jurisdiction is required' })
  @IsString()
  jurisdiction: string;
}
