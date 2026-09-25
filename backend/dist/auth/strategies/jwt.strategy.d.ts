import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    phone: string;
    role: string;
    name?: string | null;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        phone: string;
        name: string;
        role: string;
    }>;
}
export {};
