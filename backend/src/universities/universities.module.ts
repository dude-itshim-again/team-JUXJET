import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { MatchingModule } from '../matching/matching.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MatchingModule, PrismaModule],
  controllers: [UniversitiesController],
  exports: [],
})
export class UniversitiesModule {}
