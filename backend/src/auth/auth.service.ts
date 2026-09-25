import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Role } from '../common/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // In-memory OTP cache for mock OTP verification
  private readonly otpCache = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    const { phone } = dto;
    
    // Generate mock OTP (123456 default for testing or 6-digit)
    const mockOtp = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
    this.otpCache.set(phone, { otp: mockOtp, expiresAt });

    this.logger.log(`Mock OTP for phone ${phone}: ${mockOtp}`);

    return {
      success: true,
      message: `OTP sent successfully to ${phone}`,
      mockOtp: mockOtp, // Exposed for convenience during SIH evaluation/testing
      expiresInSeconds: 300,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp, name, role } = dto;

    const cached = this.otpCache.get(phone);
    const isValidOtp = (cached && cached.otp === otp && cached.expiresAt > Date.now()) || otp === '123456';

    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP. Use mock OTP: 123456');
    }

    // Clear used OTP
    this.otpCache.delete(phone);

    // Upsert or retrieve user
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          name: name || 'Citizen',
          role: role || Role.CITIZEN,
        },
      });
    } else if (role && user.role !== role) {
      // Allow switching roles during testing/demo if specified
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
}
