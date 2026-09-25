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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let DepartmentsService = class DepartmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.department.findMany({
            include: {
                _count: {
                    select: { complaints: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: {
                complaints: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID "${id}" was not found`);
        }
        return department;
    }
    async create(dto) {
        return this.prisma.department.create({
            data: dto,
        });
    }
    async assignComplaint(complaintId, departmentId, staffUserId) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID "${departmentId}" not found`);
        }
        const complaint = await this.prisma.complaint.findUnique({
            where: { id: complaintId },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with ID "${complaintId}" not found`);
        }
        return this.prisma.$transaction(async (tx) => {
            const shouldAdvanceStatus = complaint.status === enums_1.ComplaintStatus.SUBMITTED;
            const newStatus = shouldAdvanceStatus ? enums_1.ComplaintStatus.ASSIGNED : complaint.status;
            const updatedComplaint = await tx.complaint.update({
                where: { id: complaintId },
                data: {
                    departmentId,
                    status: newStatus,
                },
                include: {
                    department: true,
                },
            });
            if (shouldAdvanceStatus) {
                await tx.complaintHistory.create({
                    data: {
                        complaintId,
                        changedById: staffUserId,
                        previousStatus: complaint.status,
                        newStatus,
                    },
                });
            }
            return {
                message: `Complaint successfully assigned to department: ${department.name}`,
                complaint: updatedComplaint,
            };
        });
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map