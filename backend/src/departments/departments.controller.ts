import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { AssignDepartmentDto } from './dto/assign-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  /**
   * GET /departments
   * List all municipal departments
   */
  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  /**
   * GET /departments/:id
   * Get single department
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  /**
   * POST /departments
   * Restricted to ADMIN
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto);
  }

  /**
   * PATCH /departments/assign/:complaintId
   * Assigns complaint to a department (Restricted to STAFF / ADMIN)
   */
  @Patch('assign/:complaintId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  async assignComplaint(
    @Param('complaintId') complaintId: string,
    @Body() dto: AssignDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.departmentsService.assignComplaint(complaintId, dto.departmentId, user.id);
  }
}
