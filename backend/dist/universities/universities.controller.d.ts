import { MatchingService } from '../matching/matching.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UniversitiesController {
    private readonly matchingService;
    private readonly prisma;
    constructor(matchingService: MatchingService, prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        location: string;
        capabilities: string;
    }[]>;
    getInbox(id: string): Promise<any[]>;
    getArchives(id: string): Promise<({
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
    findOne(id: string): Promise<{
        capabilities: string[];
        complaints: {
            id: string;
            createdAt: Date;
            title: string;
            category: string;
            status: string;
            complaintNumber: string;
            sdg_target: number;
        }[];
        name: string;
        id: string;
        createdAt: Date;
        location: string;
    }>;
}
