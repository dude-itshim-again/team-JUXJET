import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { MatchingService } from '../matching/matching.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('universities')
export class UniversitiesController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /universities
   * Returns list of universities directly from Prisma
   */
  @Get()
  async findAll() {
    return this.prisma.university.findMany();
  }

  /**
   * GET /universities/:id/inbox
   * Returns incoming INNOVATION challenges sorted with highest match score at the top
   */
  @Get(':id/inbox')
  async getInbox(@Param('id') id: string) {
    console.log('Fetching inbox for:', id);
    const complaints = await this.matchingService.getUniversityInbox(id);
    console.log('Complaints found for inbox:', complaints);
    return complaints;
  }

  /**
   * GET /universities/:id/archives
   * Returns complaints accepted by this university
   */
  @Get(':id/archives')
  async getArchives(@Param('id') id: string) {
    console.log('Fetching archives for:', id);
    const uni = await this.prisma.university.findFirst({
      where: {
        OR: [{ id }, { name: id }],
      },
    });
    const targetId = uni ? uni.id : id;

    const archives = await this.prisma.complaint.findMany({
      where: {
        OR: [
          { assignedUniversityId: targetId },
          { assignedUniversityId: id },
        ],
      },
      include: {
        citizen: true,
        assignedUniversity: true,
        industryPartner: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    console.log(`Found ${archives.length} archives for university ${id}`);
    return archives;
  }

  /**
   * GET /universities/:id
   * Single university with accepted project count
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id }, { name: id }],
      },
      include: {
        complaints: {
          select: {
            id: true,
            complaintNumber: true,
            title: true,
            status: true,
            category: true,
            sdg_target: true,
            createdAt: true,
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException(`University "${id}" not found.`);
    }

    let capabilities: string[] = [];
    try {
      capabilities = JSON.parse(university.capabilities);
    } catch {
      capabilities = university.capabilities.split(',').map((c) => c.trim());
    }

    return {
      ...university,
      capabilities,
    };
  }
}
