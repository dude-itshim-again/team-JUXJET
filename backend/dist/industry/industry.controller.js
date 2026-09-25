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
exports.IndustryController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IndustryController = class IndustryController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.industry.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }
    async getAllOpportunities() {
        return this.prisma.complaint.findMany({
            where: {
                status: 'ASSIGNED',
                OR: [
                    { fundingStatus: 'PENDING' },
                    { fundingStatus: null },
                ],
            },
            include: {
                assignedUniversity: true,
                industryPartner: true,
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                department: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getOpportunities(id) {
        return this.prisma.complaint.findMany({
            where: {
                status: 'ASSIGNED',
                OR: [
                    { fundingStatus: 'PENDING' },
                    { fundingStatus: null },
                ],
            },
            include: {
                assignedUniversity: true,
                industryPartner: true,
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                department: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getPortfolio(id) {
        const ind = await this.prisma.industry.findFirst({
            where: {
                OR: [{ id }, { name: id }],
            },
        });
        const targetId = ind ? ind.id : id;
        return this.prisma.complaint.findMany({
            where: {
                OR: [
                    { industryPartnerId: targetId },
                    { industryPartnerId: id },
                ],
            },
            include: {
                assignedUniversity: true,
                industryPartner: true,
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                department: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getProjects(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return this.prisma.complaint.findMany({
            where,
            include: {
                assignedUniversity: true,
                industryPartner: true,
                citizen: {
                    select: { id: true, name: true, phone: true },
                },
                department: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.IndustryController = IndustryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('opportunities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "getAllOpportunities", null);
__decorate([
    (0, common_1.Get)(':id/opportunities'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "getOpportunities", null);
__decorate([
    (0, common_1.Get)(':id/portfolio'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "getPortfolio", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "getProjects", null);
exports.IndustryController = IndustryController = __decorate([
    (0, common_1.Controller)(['industries', 'industry']),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IndustryController);
//# sourceMappingURL=industry.controller.js.map