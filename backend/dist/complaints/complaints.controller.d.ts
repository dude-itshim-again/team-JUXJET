import { ComplaintsService } from './complaints.service';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ComplaintStatus } from '../common/enums';
import { MatchingService } from '../matching/matching.service';
export declare class ComplaintsController {
    private readonly complaintsService;
    private readonly matchingService;
    constructor(complaintsService: ComplaintsService, matchingService: MatchingService);
    create(user: AuthenticatedUser, body: any): Promise<any>;
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
            name: string | null;
            role: string;
            id: string;
            createdAt: Date;
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
            previousStatus: string;
            newStatus: string;
            timestamp: Date;
            complaintId: string;
            changedById: string | null;
        };
    }>;
}
