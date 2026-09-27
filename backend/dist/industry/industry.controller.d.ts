import { PrismaService } from '../prisma/prisma.service';
export declare class IndustryController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        location: string | null;
        sector: string | null;
    }[]>;
    getAllOpportunities(): Promise<({
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
    getOpportunities(id: string): Promise<({
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
    getPortfolio(id: string): Promise<({
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
    getProjects(status?: string): Promise<({
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
}
