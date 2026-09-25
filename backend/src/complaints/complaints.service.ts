import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintStatus, Priority } from '../common/enums';

@Injectable()
export class ComplaintsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a human-friendly unique complaint tracking number:
   * e.g. CMP-20260922-8492
   */
  private generateComplaintNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CMP-${dateStr}-${randomSuffix}`;
  }

  /**
   * Transforms raw complaint record to ensure classification (INNOVATION vs GRIEVANCE),
   * sdg_target, and parsed extracted_skills are consistently returned to UI.
   */
  private formatComplaintResponse(complaint: any) {
    if (!complaint) return null;

    let extracted_skills: string[] = [];
    const rawSkills = complaint.extracted_skills || complaint.extractedSkills;
    if (rawSkills) {
      try {
        extracted_skills = typeof rawSkills === 'string' ? JSON.parse(rawSkills) : rawSkills;
      } catch {
        extracted_skills = rawSkills.split(',').map((s: string) => s.trim());
      }
    }

    const text = `${complaint.title} ${complaint.description} ${complaint.category}`.toLowerCase();

    // Determine classification (INNOVATION vs GRIEVANCE)
    let classification = complaint.classification;
    if (!classification) {
      if (text.match(/contaminat|water|filter|arsenic|chemical|sensor|drone|soil|bridge|prototype|research|heavy metal/)) {
        classification = 'INNOVATION';
      } else {
        classification = 'GRIEVANCE';
      }
    }

    // Determine sdg_target (SDG 6: Clean Water, SDG 9: Infrastructure, SDG 2: Zero Hunger, SDG 3: Health, SDG 11: Cities)
    let sdg_target = complaint.sdg_target;
    if (!sdg_target) {
      if (text.match(/water|filter|sewage|sanitat/)) sdg_target = 6;
      else if (text.match(/road|bridge|traffic|infra|sensor/)) sdg_target = 9;
      else if (text.match(/crop|soil|farm|agricultur/)) sdg_target = 2;
      else if (text.match(/health|infection|discolor|arsenic/)) sdg_target = 3;
      else sdg_target = 11;
    }

    // Default extracted skills if not present
    if (!extracted_skills || extracted_skills.length === 0) {
      if (text.match(/water|filter|arsenic|chemical|drink/)) {
        extracted_skills = ['Chemical Engineering', 'Water Filtration', 'Spectroscopy'];
      } else if (text.match(/road|pothole|bridge|traffic|sensor/)) {
        extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
      } else if (text.match(/crop|soil|farm|agricultur|drone/)) {
        extracted_skills = ['Soil Mechanics', 'Agriculture', 'Drones'];
      } else {
        extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
      }
    }

    return {
      ...complaint,
      classification,
      sdg_target,
      extracted_skills,
    };
  }

  /**
   * Creates a new civic complaint (CITIZEN restricted)
   */
  async create(citizenId: string, dto: CreateComplaintDto) {
    const complaintNumber = this.generateComplaintNumber();
    const text = `${dto.title} ${dto.description} ${dto.category}`.toLowerCase();

    // AI Triage fields deduction
    const classification = text.match(/contaminat|water|filter|arsenic|chemical|sensor|drone|soil|bridge|prototype|research/)
      ? 'INNOVATION'
      : 'GRIEVANCE';

    let sdg_target = 9;
    if (text.match(/water|filter|sewage|sanitat/)) sdg_target = 6;
    else if (text.match(/crop|soil|farm/)) sdg_target = 2;
    else if (text.match(/health|infection/)) sdg_target = 3;

    let extracted_skills = ['Civil Engineering', 'IoT', 'Sensors', 'Roads'];
    if (text.match(/water|filter|arsenic|chemical/)) {
      extracted_skills = ['Chemical Engineering', 'Water Filtration', 'Spectroscopy'];
    } else if (text.match(/crop|soil|farm|drone/)) {
      extracted_skills = ['Soil Mechanics', 'Agriculture', 'Drones'];
    }

    const complaint = await this.prisma.$transaction(async (tx) => {
      const created = await tx.complaint.create({
        data: {
          complaintNumber,
          citizenId,
          title: dto.title,
          description: dto.address ? `${dto.description}\nAddress: ${dto.address}` : dto.description,
          category: dto.category || dto.categoryId || 'General',
          priority: dto.priority || Priority.MEDIUM,
          latitude: dto.latitude,
          longitude: dto.longitude,
          departmentId: dto.departmentId,
          classification,
          sdg_target,
          extracted_skills: JSON.stringify(extracted_skills),
          status: ComplaintStatus.SUBMITTED,
        },
        include: {
          citizen: {
            select: { id: true, name: true, phone: true },
          },
          department: true,
        },
      });

      // Automatically log the initial creation history entry
      await tx.complaintHistory.create({
        data: {
          complaintId: created.id,
          changedById: citizenId,
          previousStatus: ComplaintStatus.SUBMITTED,
          newStatus: ComplaintStatus.SUBMITTED,
        },
      });

      return created;
    });

    return this.formatComplaintResponse(complaint);
  }

  /**
   * Retrieves all complaints submitted by the authenticated citizen
   */
  async findMine(citizenId: string) {
    const complaints = await this.prisma.complaint.findMany({
      where: { citizenId },
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        assignedUniversity: true,
        industryPartner: true,
        history: {
          orderBy: { timestamp: 'asc' },
          include: {
            changedBy: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    return complaints.map((c) => this.formatComplaintResponse(c));
  }

  /**
   * Retrieves all complaints with optional filtering (STAFF / ADMIN access)
   */
  async findAll(query?: { status?: ComplaintStatus; category?: string; departmentId?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.category) where.category = query.category;
    if (query?.departmentId) where.departmentId = query.departmentId;

    const complaints = await this.prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        department: true,
        assignedUniversity: true,
        industryPartner: true,
        history: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    return complaints.map((c) => this.formatComplaintResponse(c));
  }

  /**
   * Retrieves single complaint details including entire history chain
   */
  async findOne(id: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { complaintNumber: id }],
      },
      include: {
        citizen: {
          select: { id: true, name: true, phone: true, role: true },
        },
        department: true,
        assignedUniversity: true,
        industryPartner: true,
        history: {
          orderBy: { timestamp: 'asc' },
          include: {
            changedBy: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with identifier "${id}" was not found.`);
    }

    return this.formatComplaintResponse(complaint);
  }

  /**
   * Updates complaint status and appends a ComplaintHistory audit record
   * Restricted to STAFF / ADMIN
   */
  async updateStatus(id: string, staffUserId: string, dto: UpdateComplaintStatusDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID "${id}" was not found.`);
    }

    const previousStatus = complaint.status;
    const newStatus = dto.status;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update status on Complaint
      const updated = await tx.complaint.update({
        where: { id },
        data: { status: newStatus },
        include: {
          department: true,
        },
      });

      // 2. Insert ComplaintHistory audit trail
      const historyRecord = await tx.complaintHistory.create({
        data: {
          complaintId: id,
          changedById: staffUserId,
          previousStatus,
          newStatus,
        },
        include: {
          changedBy: {
            select: { id: true, name: true, role: true },
          },
        },
      });

      return {
        message: `Complaint status successfully updated from ${previousStatus} to ${newStatus}`,
        complaint: this.formatComplaintResponse(updated),
        historyRecord,
      };
    });
  }

  /**
   * Accepts a complaint for a university lab:
   * Sets status to 'ASSIGNED' and assignedUniversityId to universityId.
   * Records entry in ComplaintHistory.
   */
  async acceptComplaint(complaintId: string, universityId: string, changedById?: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: {
        OR: [{ id: complaintId }, { complaintNumber: complaintId }],
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
    }

    if (!universityId) {
      throw new BadRequestException('universityId is required to accept a complaint.');
    }

    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id: universityId }, { name: universityId }],
      },
    });

    const targetUniversityId = university ? university.id : universityId;
    const universityName = university ? university.name : 'University Lab';

    const updated = await this.prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        status: ComplaintStatus.ASSIGNED,
        assignedUniversityId: targetUniversityId,
      },
      include: {
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        assignedUniversity: true,
        industryPartner: true,
      },
    });

    // Record history entry
    await this.prisma.complaintHistory.create({
      data: {
        complaintId: complaint.id,
        changedById: changedById || null,
        previousStatus: complaint.status,
        newStatus: ComplaintStatus.ASSIGNED,
      },
    });

    return {
      success: true,
      message: `Challenge accepted successfully by ${universityName}`,
      complaint: this.formatComplaintResponse(updated),
    };
  }

  /**
   * Releases CSR funds for an assigned innovation project
   */
  async fundComplaint(complaintId: string, industryId: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: {
        OR: [{ id: complaintId }, { complaintNumber: complaintId }],
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
    }

    if (!industryId) {
      throw new BadRequestException('industryId is required to fund a project.');
    }

    const industry = await this.prisma.industry.findFirst({
      where: {
        OR: [{ id: industryId }, { name: industryId }],
      },
    });

    const targetIndustryId = industry ? industry.id : industryId;
    const industryName = industry ? industry.name : 'Industry Partner';

    const updated = await this.prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        fundingStatus: 'FUNDED',
        industryPartnerId: targetIndustryId,
      },
      include: {
        citizen: {
          select: { id: true, name: true, phone: true },
        },
        assignedUniversity: true,
        industryPartner: true,
      },
    });

    // Record history entry
    await this.prisma.complaintHistory.create({
      data: {
        complaintId: complaint.id,
        previousStatus: complaint.status,
        newStatus: complaint.status,
      },
    });

    return {
      success: true,
      message: `Project successfully funded by ${industryName}`,
      complaint: this.formatComplaintResponse(updated),
    };
  }

  /**
   * Returns CSR innovation opportunities: status = 'ASSIGNED', fundingStatus = 'PENDING' or null
   */
  async getOpportunities() {
    return this.prisma.complaint.findMany({
      where: {
        status: ComplaintStatus.ASSIGNED,
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
}
