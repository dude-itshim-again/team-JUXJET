import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { AssignDepartmentDto } from './dto/assign-department.dto';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(): Promise<({
        _count: {
            complaints: number;
        };
    } & {
        name: string;
        id: string;
        jurisdiction: string;
    })[]>;
    findOne(id: string): Promise<{
        complaints: {
            id: string;
            createdAt: Date;
            title: string;
            description: string;
            category: string;
            priority: string;
            latitude: number | null;
            longitude: number | null;
            departmentId: string | null;
            citizenId: string | null;
            status: string;
            complaintNumber: string;
            fundingStatus: string | null;
            classification: string | null;
            sdg_target: number | null;
            extracted_skills: string | null;
            updatedAt: Date;
            assignedUniversityId: string | null;
            industryPartnerId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        jurisdiction: string;
    }>;
    create(dto: CreateDepartmentDto): Promise<{
        name: string;
        id: string;
        jurisdiction: string;
    }>;
    assignComplaint(complaintId: string, dto: AssignDepartmentDto, user: AuthenticatedUser): Promise<{
        message: string;
        complaint: {
            department: {
                name: string;
                id: string;
                jurisdiction: string;
            };
        } & {
            id: string;
            createdAt: Date;
            title: string;
            description: string;
            category: string;
            priority: string;
            latitude: number | null;
            longitude: number | null;
            departmentId: string | null;
            citizenId: string | null;
            status: string;
            complaintNumber: string;
            fundingStatus: string | null;
            classification: string | null;
            sdg_target: number | null;
            extracted_skills: string | null;
            updatedAt: Date;
            assignedUniversityId: string | null;
            industryPartnerId: string | null;
        };
    }>;
}
