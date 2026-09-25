import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
