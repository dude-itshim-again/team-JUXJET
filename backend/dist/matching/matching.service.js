"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MatchingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchingService = MatchingService_1 = class MatchingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MatchingService_1.name);
    }
    extractSkillsFromComplaint(title, description, category) {
        const text = `${title} ${description} ${category}`.toLowerCase();
        const skills = new Set();
        let classification = 'Civic Infrastructure';
        let sdg_target = 9;
        if (text.match(/water|pump|pipe|filter|contaminat|arsenic|fluoride|iron|drink|sewage|sanitat/)) {
            skills.add('Chemical Engineering');
            skills.add('Water Filtration');
            skills.add('Spectroscopy');
            classification = 'Water & Environmental Sanitation';
            sdg_target = 6;
        }
        if (text.match(/road|pothole|bridge|traffic|pavement|concrete|sensor|camera|signal|infra|crack|highway/)) {
            skills.add('Civil Engineering');
            skills.add('IoT');
            skills.add('Sensors');
            skills.add('Roads');
            classification = 'Municipal Transport & Road Infrastructure';
            sdg_target = 9;
        }
        if (text.match(/crop|soil|farm|agricultur|irrigation|pest|fertiliz|harvest|drone|groundwater|erosion/)) {
            skills.add('Soil Mechanics');
            skills.add('Agriculture');
            skills.add('Drones');
            classification = 'Agricultural & Land Resource Management';
            sdg_target = 2;
        }
        if (skills.size === 0) {
            skills.add('Civil Engineering');
            skills.add('IoT');
            skills.add('Sensors');
            skills.add('Roads');
        }
        return {
            skills: Array.from(skills),
            classification,
            sdg_target,
        };
    }
    async getMatchesForComplaint(complaintId) {
        const complaint = await this.prisma.complaint.findFirst({
            where: {
                OR: [{ id: complaintId }, { complaintNumber: complaintId }],
            },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
        }
        let extracted_skills = [];
        const rawSkills = complaint.extracted_skills || complaint.extractedSkills;
        if (rawSkills) {
            try {
                extracted_skills = JSON.parse(rawSkills);
            }
            catch {
                extracted_skills = rawSkills.split(',').map((s) => s.trim());
            }
        }
        let classification = complaint.classification;
        let sdg_target = complaint.sdg_target;
        if (!extracted_skills || extracted_skills.length === 0) {
            const triage = this.extractSkillsFromComplaint(complaint.title, complaint.description, complaint.category);
            extracted_skills = triage.skills;
            classification = classification || triage.classification;
            sdg_target = sdg_target || triage.sdg_target;
            await this.prisma.complaint.update({
                where: { id: complaint.id },
                data: {
                    extracted_skills: JSON.stringify(extracted_skills),
                    classification,
                    sdg_target,
                },
            });
        }
        this.logger.log(`Extracted skills for complaint ${complaint.complaintNumber}: ${extracted_skills.join(', ')}`);
        const universities = await this.prisma.university.findMany();
        const scoredMatches = universities.map((uni) => {
            let capabilities = [];
            try {
                capabilities = JSON.parse(uni.capabilities);
            }
            catch {
                capabilities = uni.capabilities.split(',').map((c) => c.trim());
            }
            const matchedCapabilities = [];
            for (const skill of extracted_skills) {
                const matchingCap = capabilities.find((cap) => cap.toLowerCase() === skill.toLowerCase() ||
                    cap.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(cap.toLowerCase()));
                if (matchingCap && !matchedCapabilities.includes(matchingCap)) {
                    matchedCapabilities.push(matchingCap);
                }
            }
            const overlapRatio = extracted_skills.length > 0
                ? matchedCapabilities.length / extracted_skills.length
                : 0;
            let matchPercentage = Math.round(overlapRatio * 100);
            if (matchedCapabilities.length > 0 && matchPercentage < 40) {
                matchPercentage = 50;
            }
            let explanation;
            if (matchedCapabilities.length > 0) {
                explanation = `Matched because of overlap in ${matchedCapabilities.join(', ')} (${matchPercentage}% Match)`;
            }
            else {
                explanation = `10% Baseline: General academic engineering department`;
            }
            return {
                universityId: uni.id,
                name: uni.name,
                location: uni.location,
                capabilities,
                matchedCapabilities,
                score: matchedCapabilities.length,
                matchPercentage,
                explanation,
            };
        });
        scoredMatches.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.matchPercentage - a.matchPercentage;
        });
        const topMatches = scoredMatches.slice(0, 3);
        return {
            complaintId: complaint.id,
            complaintNumber: complaint.complaintNumber,
            title: complaint.title,
            category: complaint.category,
            classification,
            sdg_target,
            extracted_skills,
            matches: topMatches,
        };
    }
    async getUniversityInbox(universityId) {
        const university = await this.prisma.university.findFirst({
            where: {
                OR: [{ id: universityId }, { name: universityId }],
            },
        });
        if (!university) {
            throw new common_1.NotFoundException(`University "${universityId}" not found.`);
        }
        let uniCapabilities = [];
        try {
            uniCapabilities = JSON.parse(university.capabilities);
        }
        catch {
            uniCapabilities = university.capabilities.split(',').map((c) => c.trim());
        }
        const complaints = await this.prisma.complaint.findMany({
            where: {
                status: 'SUBMITTED',
            },
            include: {
                assignedUniversity: true,
                citizen: true,
                industryPartner: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const inboxItems = [];
        for (const complaint of complaints) {
            let extracted_skills = [];
            const rawSkills = complaint.extracted_skills;
            if (rawSkills) {
                try {
                    extracted_skills = JSON.parse(rawSkills);
                }
                catch {
                    extracted_skills = rawSkills.split(',').map((s) => s.trim());
                }
            }
            let classification = complaint.classification || 'INNOVATION';
            let sdg_target = complaint.sdg_target;
            if (!extracted_skills || extracted_skills.length === 0) {
                const triage = this.extractSkillsFromComplaint(complaint.title, complaint.description, complaint.category);
                extracted_skills = triage.skills;
                sdg_target = sdg_target || triage.sdg_target;
            }
            const matchedCapabilities = [];
            for (const skill of extracted_skills) {
                const match = uniCapabilities.find((cap) => cap.toLowerCase() === skill.toLowerCase() ||
                    cap.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(cap.toLowerCase()));
                if (match && !matchedCapabilities.includes(match)) {
                    matchedCapabilities.push(match);
                }
            }
            const overlapRatio = extracted_skills.length > 0 ? matchedCapabilities.length / extracted_skills.length : 0;
            let matchPercentage = Math.round(overlapRatio * 100);
            if (matchedCapabilities.length > 0 && matchPercentage < 40) {
                matchPercentage = 50;
            }
            let explanation;
            if (matchedCapabilities.length > 0) {
                explanation = `Matched because of overlap in ${matchedCapabilities.join(', ')} (${matchPercentage}% Match)`;
            }
            else {
                explanation = `10% Baseline: General academic engineering department`;
            }
            inboxItems.push({
                id: complaint.id,
                complaintNumber: complaint.complaintNumber,
                title: complaint.title,
                description: complaint.description,
                category: complaint.category,
                status: complaint.status,
                priority: complaint.priority,
                latitude: complaint.latitude,
                longitude: complaint.longitude,
                classification: 'INNOVATION',
                sdg_target: sdg_target || 6,
                extracted_skills,
                createdAt: complaint.createdAt,
                citizen: complaint.citizen,
                assignedUniversity: complaint.assignedUniversity,
                industryPartner: complaint.industryPartner,
                matchScore: matchedCapabilities.length,
                matchPercentage,
                matchedCapabilities,
                explanation,
                universityId: university.id,
                universityName: university.name,
            });
        }
        inboxItems.sort((a, b) => {
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            return b.matchPercentage - a.matchPercentage;
        });
        return inboxItems;
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = MatchingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchingService);
//# sourceMappingURL=matching.service.js.map