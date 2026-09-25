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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversitiesController = void 0;
const common_1 = require("@nestjs/common");
const matching_service_1 = require("../matching/matching.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UniversitiesController = class UniversitiesController {
    constructor(matchingService, prisma) {
        this.matchingService = matchingService;
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.university.findMany();
    }
    async getInbox(id) {
        console.log('Fetching inbox for:', id);
        const complaints = await this.matchingService.getUniversityInbox(id);
        console.log('Complaints found for inbox:', complaints);
        return complaints;
    }
    async getArchives(id) {
        console.log('Fetching archives for:', id);
        const uni = await this.prisma.university.findFirst({
            where: {
                OR: [{ id }, { name: id }],
            },
        });
        const targetId = uni ? uni.id : id;
        const archives = await this.prisma.complaint.findMany({
            where: {
                OR: [
                    { assignedUniversityId: targetId },
                    { assignedUniversityId: id },
                ],
            },
            include: {
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                assignedUniversity: true,
                industryPartner: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        console.log(`Found ${archives.length} archives for university ${id}`);
        return archives;
    }
    async findOne(id) {
        const university = await this.prisma.university.findFirst({
            where: {
                OR: [{ id }, { name: id }],
            },
            include: {
                complaints: {
                    select: {
                        id: true,
                        complaintNumber: true,
                        title: true,
                        status: true,
                        category: true,
                        sdg_target: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!university) {
            throw new common_1.NotFoundException(`University "${id}" not found.`);
        }
        let capabilities = [];
        try {
            capabilities = JSON.parse(university.capabilities);
        }
        catch {
            capabilities = university.capabilities.split(',').map((c) => c.trim());
        }
        return {
            ...university,
            capabilities,
        };
    }
};
exports.UniversitiesController = UniversitiesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UniversitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/inbox'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversitiesController.prototype, "getInbox", null);
__decorate([
    (0, common_1.Get)(':id/archives'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversitiesController.prototype, "getArchives", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversitiesController.prototype, "findOne", null);
exports.UniversitiesController = UniversitiesController = __decorate([
    (0, common_1.Controller)('universities'),
    __metadata("design:paramtypes", [matching_service_1.MatchingService,
        prisma_service_1.PrismaService])
], UniversitiesController);
//# sourceMappingURL=universities.controller.js.map