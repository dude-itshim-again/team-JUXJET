import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ComplaintStatus } from '../common/enums';
import { MatchingService } from '../matching/matching.service';
export declare class ComplaintsController {
    private readonly complaintsService;
    private readonly matchingService;
    constructor(complaintsService: ComplaintsService, matchingService: MatchingService);
    create(user: AuthenticatedUser, dto: CreateComplaintDto): Promise<any>;
    findMine(user: AuthenticatedUser): Promise<any[]>;
    findAll(status?: ComplaintStatus, category?: string, departmentId?: string): Promise<any[]>;
    getMatches(id: string): Promise<import("../matching/matching.service").ComplaintMatchingResponse>;
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
    findOne(id: string): Promise<any>;
    acceptComplaint(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        complaint: any;
    }>;
    fundComplaint(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        complaint: any;
    }>;
    updateStatus(id: string, user: AuthenticatedUser, dto: UpdateComplaintStatusDto): Promise<{
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
}
