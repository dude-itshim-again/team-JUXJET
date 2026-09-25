import { PrismaService } from '../prisma/prisma.service';
export declare class IndustryController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        sector: string | null;
        location: string | null;
        createdAt: Date;
    }[]>;
    getAllOpportunities(): Promise<({
        citizen: {
            id: string;
            name: string;
            phone: string;
        };
        department: {
            id: string;
            name: string;
            jurisdiction: string;
        };
        assignedUniversity: {
            id: string;
            name: string;
            location: string;
            createdAt: Date;
            capabilities: string;
        };
        industryPartner: {
            id: string;
            name: string;
            sector: string | null;
            location: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        complaintNumber: string;
        citizenId: string | null;
        title: string;
        description: string;
        category: string;
        status: string;
        priority: string;
        latitude: number | null;
        longitude: number | null;
        departmentId: string | null;
        assignedUniversityId: string | null;
        fundingStatus: string | null;
        industryPartnerId: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        updatedAt: Date;
    })[]>;
    getOpportunities(id: string): Promise<({
        citizen: {
            id: string;
            name: string;
            phone: string;
        };
        department: {
            id: string;
            name: string;
            jurisdiction: string;
        };
        assignedUniversity: {
            id: string;
            name: string;
            location: string;
            createdAt: Date;
            capabilities: string;
        };
        industryPartner: {
            id: string;
            name: string;
            sector: string | null;
            location: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        complaintNumber: string;
        citizenId: string | null;
        title: string;
        description: string;
        category: string;
        status: string;
        priority: string;
        latitude: number | null;
        longitude: number | null;
        departmentId: string | null;
        assignedUniversityId: string | null;
        fundingStatus: string | null;
        industryPartnerId: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        updatedAt: Date;
    })[]>;
    getPortfolio(id: string): Promise<({
        citizen: {
            id: string;
            name: string;
            phone: string;
        };
        department: {
            id: string;
            name: string;
            jurisdiction: string;
        };
        assignedUniversity: {
            id: string;
            name: string;
            location: string;
            createdAt: Date;
            capabilities: string;
        };
        industryPartner: {
            id: string;
            name: string;
            sector: string | null;
            location: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        complaintNumber: string;
        citizenId: string | null;
        title: string;
        description: string;
        category: string;
        status: string;
        priority: string;
        latitude: number | null;
        longitude: number | null;
        departmentId: string | null;
        assignedUniversityId: string | null;
        fundingStatus: string | null;
        industryPartnerId: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        updatedAt: Date;
    })[]>;
    getProjects(status?: string): Promise<({
        citizen: {
            id: string;
            name: string;
            phone: string;
        };
        department: {
            id: string;
            name: string;
            jurisdiction: string;
        };
        assignedUniversity: {
            id: string;
            name: string;
            location: string;
            createdAt: Date;
            capabilities: string;
        };
        industryPartner: {
            id: string;
            name: string;
            sector: string | null;
            location: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        complaintNumber: string;
        citizenId: string | null;
        title: string;
        description: string;
        category: string;
        status: string;
        priority: string;
        latitude: number | null;
        longitude: number | null;
        departmentId: string | null;
        assignedUniversityId: string | null;
        fundingStatus: string | null;
        industryPartnerId: string | null;
        classification: string | null;
        sdg_target: number | null;
        extracted_skills: string | null;
        updatedAt: Date;
    })[]>;
}
