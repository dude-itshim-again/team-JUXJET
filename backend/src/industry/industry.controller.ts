import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller(['industries', 'industry'])
export class IndustryController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /industries
   * Returns list of all CSR industry partners
   */
  @Get()
  async findAll() {
    return this.prisma.industry.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * GET /industries/opportunities or GET /industry/opportunities
   * Returns complaints where status === 'ASSIGNED' and fundingStatus is 'PENDING' or null
   */
  @Get('opportunities')
  async getAllOpportunities() {
    return this.prisma.complaint.findMany({
      where: {
        status: 'ASSIGNED',
        OR: [
          { fundingStatus: 'PENDING' },
          { fundingStatus: null },
        ],
      },
      include: {
        assignedUniversity: true,
        industryPartner: true,
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        department: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * GET /industries/:id/opportunities
   * Returns complaints where status === 'ASSIGNED' and fundingStatus === 'PENDING' or null
   * Crucial: Includes assignedUniversity relation
   */
  @Get(':id/opportunities')
  async getOpportunities(@Param('id') id: string) {
    return this.prisma.complaint.findMany({
      where: {
        status: 'ASSIGNED',
        OR: [
          { fundingStatus: 'PENDING' },
          { fundingStatus: null },
        ],
      },
      include: {
        assignedUniversity: true,
        industryPartner: true,
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        department: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * GET /industries/:id/portfolio
   * Returns complaints where industryPartnerId === id
   * Crucial: Includes assignedUniversity relation
   */
  @Get(':id/portfolio')
  async getPortfolio(@Param('id') id: string) {
    const ind = await this.prisma.industry.findFirst({
      where: {
        OR: [{ id }, { name: id }],
      },
    });
    const targetId = ind ? ind.id : id;

    return this.prisma.complaint.findMany({
      where: {
        OR: [
          { industryPartnerId: targetId },
          { industryPartnerId: id },
        ],
      },
      include: {
        assignedUniversity: true,
        industryPartner: true,
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        department: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * GET /industry/projects
   * Returns all fundable projects for industry
   */
  @Get('projects')
  async getProjects(@Query('status') status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.prisma.complaint.findMany({
      where,
      include: {
        assignedUniversity: true,
        industryPartner: true,
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        department: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
