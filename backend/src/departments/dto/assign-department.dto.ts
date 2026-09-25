import { IsNotEmpty, IsString } from 'class-validator';

export class AssignDepartmentDto {
  @IsNotEmpty({ message: 'Department ID is required' })
  @IsString()
  departmentId: string;
}
