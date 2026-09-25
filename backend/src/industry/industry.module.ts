import { Module } from '@nestjs/common';
import { IndustryController } from './industry.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IndustryController],
})
export class IndustryModule {}
