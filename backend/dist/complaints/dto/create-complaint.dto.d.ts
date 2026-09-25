import { Priority } from '../../common/enums';
export declare class CreateComplaintDto {
    title: string;
    description: string;
    category?: string;
    categoryId?: string;
    address?: string;
    priority?: Priority;
    latitude?: number;
    longitude?: number;
    departmentId?: string;
}
