import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { ComplaintStatus, Role } from '../common/enums';

import { MatchingService } from '../matching/matching.service';

@Controller('complaints')
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService,
    private readonly matchingService: MatchingService,
  ) {}

  /**
   * POST /complaints
   * Restricted to CITIZEN
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CITIZEN)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateComplaintDto,
  ) {
    return this.complaintsService.create(user.id, dto);
  }

  /**
   * GET /complaints/mine
   * Returns current authenticated citizen's complaints
   */
  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CITIZEN)
  async findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.complaintsService.findMine(user.id);
  }

  /**
   * GET /complaints
   * View complaints (Accessible to CITIZEN, STAFF, ADMIN)
   */
  @Get()
  async findAll(
    @Query('status') status?: ComplaintStatus,
    @Query('category') category?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.complaintsService.findAll({ status, category, departmentId });
  }

  /**
   * GET /complaints/:id/matches
   * Returns top 3 matched universities based on engineering skill overlap
   */
  @Get(':id/matches')
  async getMatches(@Param('id') id: string) {
    return this.matchingService.getMatchesForComplaint(id);
  }

  /**
   * GET /complaints/opportunities
   * Returns CSR innovation opportunities awaiting funding
   */
  @Get('opportunities')
  async getOpportunities() {
    return this.complaintsService.getOpportunities();
  }

  /**
   * GET /complaints/:id
   * Retrieve complaint by ID or complaintNumber with timeline history
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  /**
   * POST /complaints/:id/accept
   * Accepts a complaint for a university lab, updating status to ASSIGNED and linking university
   */
  @Post(':id/accept')
  async acceptComplaint(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const universityId = body?.universityId || (typeof body === 'string' ? body : undefined);
    console.log(`Accepting project for complaint: ${id}, universityId: ${universityId}`);
    try {
      const result = await this.complaintsService.acceptComplaint(id, universityId);
      console.log(`Acceptance successful for complaint ${id}:`, result.message);
      return result;
    } catch (err: any) {
      console.error(`Acceptance failed for complaint ${id}:`, err?.message || err);
      throw err;
    }
  }

  /**
   * POST /complaints/:id/fund
   * Releases CSR funds for an assigned innovation complaint.
   * Sets fundingStatus = 'FUNDED' and industryPartnerId = body.industryId
   */
  @Post(':id/fund')
  async fundComplaint(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const industryId = body?.industryId || body?.industryPartnerId || (typeof body === 'string' ? body : undefined);
    console.log(`Funding complaint: ${id}, industryId: ${industryId}`);
    try {
      const result = await this.complaintsService.fundComplaint(id, industryId);
      console.log(`Funding successful for complaint ${id}:`, result.message);
      return result;
    } catch (err: any) {
      console.error(`Funding failed for complaint ${id}:`, err?.message || err);
      throw err;
    }
  }

  /**
   * PATCH /complaints/:id/status
   * Restricted to STAFF / ADMIN
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintsService.updateStatus(id, user.id, dto);
  }
}
