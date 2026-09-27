import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
export declare class DepartmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    assignComplaint(complaintId: string, departmentId: string, staffUserId?: string): Promise<{
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
