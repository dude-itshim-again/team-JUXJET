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
exports.ComplaintsController = void 0;
const common_1 = require("@nestjs/common");
const complaints_service_1 = require("./complaints.service");
const create_complaint_dto_1 = require("./dto/create-complaint.dto");
const update_complaint_status_dto_1 = require("./dto/update-complaint-status.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
const matching_service_1 = require("../matching/matching.service");
let ComplaintsController = class ComplaintsController {
    constructor(complaintsService, matchingService) {
        this.complaintsService = complaintsService;
        this.matchingService = matchingService;
    }
    async create(user, dto) {
        return this.complaintsService.create(user.id, dto);
    }
    async findMine(user) {
        return this.complaintsService.findMine(user.id);
    }
    async findAll(status, category, departmentId) {
        return this.complaintsService.findAll({ status, category, departmentId });
    }
    async getMatches(id) {
        return this.matchingService.getMatchesForComplaint(id);
    }
    async getOpportunities() {
        return this.complaintsService.getOpportunities();
    }
    async findOne(id) {
        return this.complaintsService.findOne(id);
    }
    async acceptComplaint(id, body) {
        const universityId = body?.universityId || (typeof body === 'string' ? body : undefined);
        console.log(`Accepting project for complaint: ${id}, universityId: ${universityId}`);
        try {
            const result = await this.complaintsService.acceptComplaint(id, universityId);
            console.log(`Acceptance successful for complaint ${id}:`, result.message);
            return result;
        }
        catch (err) {
            console.error(`Acceptance failed for complaint ${id}:`, err?.message || err);
            throw err;
        }
    }
    async fundComplaint(id, body) {
        const industryId = body?.industryId || body?.industryPartnerId || (typeof body === 'string' ? body : undefined);
        console.log(`Funding complaint: ${id}, industryId: ${industryId}`);
        try {
            const result = await this.complaintsService.fundComplaint(id, industryId);
            console.log(`Funding successful for complaint ${id}:`, result.message);
            return result;
        }
        catch (err) {
            console.error(`Funding failed for complaint ${id}:`, err?.message || err);
            throw err;
        }
    }
    async updateStatus(id, user, dto) {
        return this.complaintsService.updateStatus(id, user.id, dto);
    }
};
exports.ComplaintsController = ComplaintsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.CITIZEN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_complaint_dto_1.CreateComplaintDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.CITIZEN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/matches'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Get)('opportunities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "getOpportunities", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "acceptComplaint", null);
__decorate([
    (0, common_1.Post)(':id/fund'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "fundComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.STAFF, enums_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_complaint_status_dto_1.UpdateComplaintStatusDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "updateStatus", null);
exports.ComplaintsController = ComplaintsController = __decorate([
    (0, common_1.Controller)('complaints'),
    __metadata("design:paramtypes", [complaints_service_1.ComplaintsService,
        matching_service_1.MatchingService])
], ComplaintsController);
//# sourceMappingURL=complaints.controller.js.map