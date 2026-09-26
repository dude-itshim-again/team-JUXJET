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
                name: string;
                role: string;
                id: string;
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
            name: string;
            id: string;
            jurisdiction: string;
        };
        citizen: {
            phone: string;
            name: string;
            id: string;
        };
        assignedUniversity: {
            name: string;
            id: string;
            createdAt: Date;
            location: string;
            capabilities: string;
        };
        industryPartner: {
            name: string;
            id: string;
            createdAt: Date;
            location: string | null;
            sector: string | null;
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
        status: string;
        complaintNumber: string;
        fundingStatus: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        updatedAt: Date;
        citizenId: string | null;
        assignedUniversityId: string | null;
        industryPartnerId: string | null;
    })[]>;
}
