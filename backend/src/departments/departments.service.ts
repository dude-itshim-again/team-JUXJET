import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ComplaintStatus } from '../common/enums';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: { complaints: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        complaints: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" was not found`);
    }

    return department;
  }

  async create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: dto,
    });
  }

  async assignComplaint(complaintId: string, departmentId: string, staffUserId?: string) {
    // 1. Verify department exists
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID "${departmentId}" not found`);
    }

    // 2. Verify complaint exists
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID "${complaintId}" not found`);
    }

    // 3. Atomically assign department and advance status if SUBMITTED
    return this.prisma.$transaction(async (tx) => {
      const shouldAdvanceStatus = complaint.status === ComplaintStatus.SUBMITTED;
      const newStatus = shouldAdvanceStatus ? ComplaintStatus.ASSIGNED : complaint.status;

      const updatedComplaint = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          departmentId,
          status: newStatus,
        },
        include: {
          department: true,
        },
      });

      if (shouldAdvanceStatus) {
        await tx.complaintHistory.create({
          data: {
            complaintId,
            changedById: staffUserId,
            previousStatus: complaint.status,
            newStatus,
          },
        });
      }

      return {
        message: `Complaint successfully assigned to department: ${department.name}`,
        complaint: updatedComplaint,
      };
    });
  }
}
