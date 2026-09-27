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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let ComplaintsService = class ComplaintsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateComplaintNumber() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        return `CMP-${dateStr}-${randomSuffix}`;
    }
    formatComplaintResponse(complaint) {
        if (!complaint)
            return null;
        let extracted_skills = [];
        const rawSkills = complaint.extracted_skills || complaint.extractedSkills;
        if (rawSkills) {
            try {
                extracted_skills = typeof rawSkills === 'string' ? JSON.parse(rawSkills) : rawSkills;
            }
            catch {
                extracted_skills = rawSkills.split(',').map((s) => s.trim());
            }
        }
        const text = `${complaint.title} ${complaint.description} ${complaint.category}`.toLowerCase();
        let classification = complaint.classification;
        if (!classification) {
            if (text.match(/contaminat|water|filter|arsenic|chemical|sensor|drone|soil|bridge|prototype|research|heavy metal/)) {
                classification = 'INNOVATION';
            }
            else {
                classification = 'GRIEVANCE';
            }
        }
        let sdg_target = complaint.sdg_target;
        if (!sdg_target) {
            if (text.match(/water|filter|sewage|sanitat/))
                sdg_target = 6;
            else if (text.match(/road|bridge|traffic|infra|sensor/))
                sdg_target = 9;
            else if (text.match(/crop|soil|farm|agricultur/))
                sdg_target = 2;
            else if (text.match(/health|infection|discolor|arsenic/))
                sdg_target = 3;
            else
                sdg_target = 11;
        }
        if (!extracted_skills || extracted_skills.length === 0) {
            if (text.match(/water|filter|arsenic|chemical|drink/)) {
                extracted_skills = ['Chemical Engineering', 'Water Filtration', 'Spectroscopy'];
            }
            else if (text.match(/road|pothole|bridge|traffic|sensor/)) {
                extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
            }
            else if (text.match(/crop|soil|farm|agricultur|drone/)) {
                extracted_skills = ['Soil Mechanics', 'Agriculture', 'Drones'];
            }
            else {
                extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
            }
        }
        return {
            ...complaint,
            classification,
            sdg_target,
            extracted_skills,
        };
    }
    async create(bodyOrCitizenId, maybeDto) {
        let body;
        if (typeof bodyOrCitizenId === 'string') {
            body = { ...(maybeDto || {}), citizenId: bodyOrCitizenId };
        }
        else {
            body = { ...(bodyOrCitizenId || {}) };
        }
        try {
            let activeCitizenId = body.citizenId;
            if (activeCitizenId) {
                const userExists = await this.prisma.user.findUnique({
                    where: { id: activeCitizenId },
                });
                if (!userExists) {
                    try {
                        const newUser = await this.prisma.user.create({
                            data: {
                                id: activeCitizenId,
                                phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                                name: 'Citizen',
                                role: 'CITIZEN',
                            },
                        });
                        activeCitizenId = newUser.id;
                    }
                    catch {
                        const fallbackUser = await this.prisma.user.findFirst();
                        if (fallbackUser)
                            activeCitizenId = fallbackUser.id;
                    }
                }
            }
            else {
                const fallbackUser = await this.prisma.user.findFirst();
                if (fallbackUser)
                    activeCitizenId = fallbackUser.id;
            }
            const text = `${body.title || ''} ${body.description || ''} ${body.category || ''}`.toLowerCase();
            let classification = body.classification;
            if (!classification) {
                classification = text.match(/contaminat|water|filter|arsenic|chemical|sensor|drone|soil|bridge|prototype|research/)
                    ? 'INNOVATION'
                    : 'GRIEVANCE';
            }
            let sdg_target = body.sdg_target;
            if (!sdg_target) {
                if (text.match(/water|filter|sewage|sanitat/))
                    sdg_target = 6;
                else if (text.match(/crop|soil|farm/))
                    sdg_target = 2;
                else if (text.match(/health|infection/))
                    sdg_target = 3;
                else
                    sdg_target = 9;
            }
            let extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
            if (text.match(/water|filter|arsenic|chemical/)) {
                extracted_skills = ['Chemical Engineering', 'Water Filtration', 'Spectroscopy'];
            }
            else if (text.match(/crop|soil|farm|drone/)) {
                extracted_skills = ['Soil Mechanics', 'Agriculture', 'Drones'];
            }
            const newComplaint = await this.prisma.complaint.create({
                data: {
                    complaintNumber: body.complaintNumber || this.generateComplaintNumber(),
                    title: body.title,
                    description: body.address ? `${body.description}\nAddress: ${body.address}` : body.description,
                    category: body.category || 'GENERAL',
                    priority: body.priority || 'MEDIUM',
                    status: 'SUBMITTED',
                    latitude: Number(body.latitude) || 0,
                    longitude: Number(body.longitude) || 0,
                    citizenId: activeCitizenId || null,
                    departmentId: body.departmentId || null,
                    classification,
                    sdg_target,
                    extracted_skills: JSON.stringify(extracted_skills),
                },
                include: {
                    citizen: true,
                    assignedUniversity: true,
                    industryPartner: true,
                },
            });
            try {
                await this.prisma.complaintHistory.create({
                    data: {
                        complaintId: newComplaint.id,
                        changedById: activeCitizenId || null,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'SUBMITTED',
                    },
                });
            }
            catch (histError) {
                console.warn('History creation warning:', histError);
            }
            return this.formatComplaintResponse(newComplaint) || newComplaint;
        }
        catch (error) {
            console.error('Prisma Error:', error);
            throw error;
        }
    }
    async findMine(citizenId) {
        const complaints = await this.prisma.complaint.findMany({
            where: { citizenId },
            orderBy: { createdAt: 'desc' },
            include: {
                department: true,
                assignedUniversity: true,
                industryPartner: true,
                history: {
                    orderBy: { timestamp: 'asc' },
                    include: {
                        changedBy: {
                            select: { id: true, name: true, role: true },
                        },
                    },
                },
            },
        });
        return complaints.map((c) => this.formatComplaintResponse(c));
    }
    async findAll(query) {
        const where = {};
        if (query?.status)
            where.status = query.status;
        if (query?.category)
            where.category = query.category;
        if (query?.departmentId)
            where.departmentId = query.departmentId;
        const complaints = await this.prisma.complaint.findMany({
            where: Object.keys(where).length > 0 ? where : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                citizen: true,
                assignedUniversity: true,
                industryPartner: true,
                department: true,
                history: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        });
        return complaints.map((c) => this.formatComplaintResponse(c));
    }
    async findOne(id) {
        const complaint = await this.prisma.complaint.findFirst({
            where: {
                OR: [{ id }, { complaintNumber: id }],
            },
            include: {
                citizen: {
                    select: { id: true, name: true, phone: true, role: true },
                },
                department: true,
                assignedUniversity: true,
                industryPartner: true,
                history: {
                    orderBy: { timestamp: 'asc' },
                    include: {
                        changedBy: {
                            select: { id: true, name: true, role: true },
                        },
                    },
                },
            },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with identifier "${id}" was not found.`);
        }
        return this.formatComplaintResponse(complaint);
    }
    async updateStatus(id, staffUserId, dto) {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with ID "${id}" was not found.`);
        }
        const previousStatus = complaint.status;
        const newStatus = dto.status;
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.complaint.update({
                where: { id },
                data: { status: newStatus },
                include: {
                    department: true,
                },
            });
            const historyRecord = await tx.complaintHistory.create({
                data: {
                    complaintId: id,
                    changedById: staffUserId,
                    previousStatus,
                    newStatus,
                },
                include: {
                    changedBy: {
                        select: { id: true, name: true, role: true },
                    },
                },
            });
            return {
                message: `Complaint status successfully updated from ${previousStatus} to ${newStatus}`,
                complaint: this.formatComplaintResponse(updated),
                historyRecord,
            };
        });
    }
    async acceptComplaint(complaintId, universityId, changedById) {
        const complaint = await this.prisma.complaint.findFirst({
            where: {
                OR: [{ id: complaintId }, { complaintNumber: complaintId }],
            },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
        }
        if (!universityId) {
            throw new common_1.BadRequestException('universityId is required to accept a complaint.');
        }
        const university = await this.prisma.university.findFirst({
            where: {
                OR: [{ id: universityId }, { name: universityId }],
            },
        });
        const targetUniversityId = university ? university.id : universityId;
        const universityName = university ? university.name : 'University Lab';
        const updated = await this.prisma.complaint.update({
            where: { id: complaint.id },
            data: {
                status: enums_1.ComplaintStatus.ASSIGNED,
                assignedUniversityId: targetUniversityId,
            },
            include: {
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                assignedUniversity: true,
                industryPartner: true,
            },
        });
        await this.prisma.complaintHistory.create({
            data: {
                complaintId: complaint.id,
                changedById: changedById || null,
                previousStatus: complaint.status,
                newStatus: enums_1.ComplaintStatus.ASSIGNED,
            },
        });
        return {
            success: true,
            message: `Challenge accepted successfully by ${universityName}`,
            complaint: this.formatComplaintResponse(updated),
        };
    }
    async fundComplaint(complaintId, industryId) {
        const complaint = await this.prisma.complaint.findFirst({
            where: {
                OR: [{ id: complaintId }, { complaintNumber: complaintId }],
            },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
        }
        if (!industryId) {
            throw new common_1.BadRequestException('industryId is required to fund a project.');
        }
        const industry = await this.prisma.industry.findFirst({
            where: {
                OR: [{ id: industryId }, { name: industryId }],
            },
        });
        const targetIndustryId = industry ? industry.id : industryId;
        const industryName = industry ? industry.name : 'Industry Partner';
        const updated = await this.prisma.complaint.update({
            where: { id: complaint.id },
            data: {
                fundingStatus: 'FUNDED',
                industryPartnerId: targetIndustryId,
            },
            include: {
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                assignedUniversity: true,
                industryPartner: true,
            },
        });
        await this.prisma.complaintHistory.create({
            data: {
                complaintId: complaint.id,
                previousStatus: complaint.status,
                newStatus: complaint.status,
            },
        });
        return {
            success: true,
            message: `Project successfully funded by ${industryName}`,
            complaint: this.formatComplaintResponse(updated),
        };
    }
    async getOpportunities() {
        return this.prisma.complaint.findMany({
            where: {
                status: enums_1.ComplaintStatus.ASSIGNED,
                OR: [
                    { fundingStatus: 'PENDING' },
                    { fundingStatus: null },
                ],
            },
            include: {
                assignedUniversity: true,
                industryPartner: true,
                citizen: true,
                department: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map