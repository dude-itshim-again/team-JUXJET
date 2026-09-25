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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.otpCache = new Map();
    }
    async requestOtp(dto) {
        const { phone } = dto;
        const mockOtp = '123456';
        const expiresAt = Date.now() + 5 * 60 * 1000;
        this.otpCache.set(phone, { otp: mockOtp, expiresAt });
        this.logger.log(`Mock OTP for phone ${phone}: ${mockOtp}`);
        return {
            success: true,
            message: `OTP sent successfully to ${phone}`,
            mockOtp: mockOtp,
            expiresInSeconds: 300,
        };
    }
    async verifyOtp(dto) {
        const { phone, otp, name, role } = dto;
        const cached = this.otpCache.get(phone);
        const isValidOtp = (cached && cached.otp === otp && cached.expiresAt > Date.now()) || otp === '123456';
        if (!isValidOtp) {
            throw new common_1.BadRequestException('Invalid or expired OTP. Use mock OTP: 123456');
        }
        this.otpCache.delete(phone);
        let user = await this.prisma.user.findUnique({
            where: { phone },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    name: name || 'Citizen',
                    role: role || enums_1.Role.CITIZEN,
                },
            });
        }
        else if (role && user.role !== role) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { role },
            });
        }
        const payload = {
            sub: user.id,
            phone: user.phone,
            name: user.name,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map