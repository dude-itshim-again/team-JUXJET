import { Role } from '../../common/enums';
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
    name?: string;
    role?: Role;
}
