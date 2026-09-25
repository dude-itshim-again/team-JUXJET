import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { DepartmentsModule } from './departments/departments.module';
import { MatchingModule } from './matching/matching.module';
import { UniversitiesModule } from './universities/universities.module';
import { IndustryModule } from './industry/industry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    ComplaintsModule,
    DepartmentsModule,
    MatchingModule,
    UniversitiesModule,
    IndustryModule,
  ],
})
export class AppModule {}
