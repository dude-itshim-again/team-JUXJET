import { PrismaService } from '../prisma/prisma.service';
export interface UniversityMatchResult {
    universityId: string;
    name: string;
    location: string;
    capabilities: string[];
    matchedCapabilities: string[];
    score: number;
    matchPercentage: number;
    explanation: string;
}
export interface ComplaintMatchingResponse {
    complaintId: string;
    complaintNumber: string;
    title: string;
    category: string;
    classification?: string | null;
    sdg_target?: number | null;
    extracted_skills: string[];
    matches: UniversityMatchResult[];
}
export declare class MatchingService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private extractSkillsFromComplaint;
    getMatchesForComplaint(complaintId: string): Promise<ComplaintMatchingResponse>;
    getUniversityInbox(universityId: string): Promise<any[]>;
}
