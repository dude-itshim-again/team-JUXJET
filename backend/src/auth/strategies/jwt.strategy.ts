import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  phone: string;
  role: string;
  name?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-for-sih26043-civic-platform-replace-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    let user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      try {
        user = await this.prisma.user.create({
          data: {
            id: payload.sub,
            phone: payload.phone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            name: payload.name || 'Citizen',
            role: payload.role || 'CITIZEN',
          },
        });
      } catch {
        user = await this.prisma.user.findFirst();
      }
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
  }
}
