import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ComplaintStatus } from '../../common/enums';

export class UpdateComplaintStatusDto {
  @IsNotEmpty({ message: 'New status is required' })
  @IsEnum(ComplaintStatus, {
    message: 'Status must be one of: SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED',
  })
  status: ComplaintStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
