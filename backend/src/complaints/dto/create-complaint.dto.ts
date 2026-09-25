import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from '../../common/enums';

export class CreateComplaintDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be LOW, MEDIUM, HIGH, or CRITICAL' })
  priority?: Priority;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude must be a valid number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude?: number;

  @IsOptional()
  @IsString()
  departmentId?: string;
}
