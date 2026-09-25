import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    private readonly otpCache;
    constructor(prisma: PrismaService, jwtService: JwtService);
    requestOtp(dto: RequestOtpDto): Promise<{
        success: boolean;
        message: string;
        mockOtp: string;
        expiresInSeconds: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        access_token: string;
        token_type: string;
        user: {
            id: string;
            phone: string;
            name: string;
            role: string;
        };
    }>;
}
