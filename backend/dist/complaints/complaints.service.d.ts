import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintStatus } from '../common/enums';
export declare class ComplaintsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateComplaintNumber;
    private formatComplaintResponse;
    create(citizenId: string, dto: CreateComplaintDto): Promise<any>;
    findMine(citizenId: string): Promise<any[]>;
    findAll(query?: {
        status?: ComplaintStatus;
        category?: string;
        departmentId?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    updateStatus(id: string, staffUserId: string, dto: UpdateComplaintStatusDto): Promise<{
        message: string;
        complaint: any;
        historyRecord: {
            changedBy: {
                id: string;
                name: string;
                role: string;
            };
        } & {
            id: string;
            timestamp: Date;
            complaintId: string;
            changedById: string | null;
            previousStatus: string;
            newStatus: string;
        };
    }>;
    acceptComplaint(complaintId: string, universityId: string, changedById?: string): Promise<{
        success: boolean;
        message: string;
        complaint: any;
    }>;
    fundComplaint(complaintId: string, industryId: string): Promise<{
        success: boolean;
        message: string;
        complaint: any;
    }>;
    getOpportunities(): Promise<({
        department: {
            id: string;
            name: string;
            jurisdiction: string;
        };
        citizen: {
            id: string;
            phone: string;
            name: string;
        };
        assignedUniversity: {
            id: string;
            createdAt: Date;
            name: string;
            location: string;
            capabilities: string;
        };
        industryPartner: {
            id: string;
            createdAt: Date;
            name: string;
            location: string | null;
            sector: string | null;
        };
    } & {
        id: string;
        complaintNumber: string;
        title: string;
        description: string;
        category: string;
        status: string;
        priority: string;
        latitude: number | null;
        longitude: number | null;
        fundingStatus: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        createdAt: Date;
        updatedAt: Date;
        citizenId: string | null;
        departmentId: string | null;
        assignedUniversityId: string | null;
        industryPartnerId: string | null;
    })[]>;
}
