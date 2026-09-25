import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UniversityMatchResult {
  universityId: string;
  name: string;
  location: string;
  capabilities: string[];
  matchedCapabilities: string[];
  score: number;
  matchPercentage: number;
  explanation: string;
}

export interface ComplaintMatchingResponse {
  complaintId: string;
  complaintNumber: string;
  title: string;
  category: string;
  classification?: string | null;
  sdg_target?: number | null;
  extracted_skills: string[];
  matches: UniversityMatchResult[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Intelligently extracts engineering capabilities & skills from complaint content
   * if not already extracted by AI.
   */
  private extractSkillsFromComplaint(title: string, description: string, category: string): {
    skills: string[];
    classification: string;
    sdg_target: number;
  } {
    const text = `${title} ${description} ${category}`.toLowerCase();
    const skills = new Set<string>();
    let classification = 'Civic Infrastructure';
    let sdg_target = 9; // SDG 9: Industry, Innovation and Infrastructure

    // Water, sanitation & chemical engineering
    if (text.match(/water|pump|pipe|filter|contaminat|arsenic|fluoride|iron|drink|sewage|sanitat/)) {
      skills.add('Chemical Engineering');
      skills.add('Water Filtration');
      skills.add('Spectroscopy');
      classification = 'Water & Environmental Sanitation';
      sdg_target = 6; // SDG 6: Clean Water and Sanitation
    }

    // Civil, infrastructure, roads & IoT sensors
    if (text.match(/road|pothole|bridge|traffic|pavement|concrete|sensor|camera|signal|infra|crack|highway/)) {
      skills.add('Civil Engineering');
      skills.add('IoT');
      skills.add('Sensors');
      skills.add('Roads');
      classification = 'Municipal Transport & Road Infrastructure';
      sdg_target = 9; // SDG 9
    }

    // Agriculture, soil, drone monitoring
    if (text.match(/crop|soil|farm|agricultur|irrigation|pest|fertiliz|harvest|drone|groundwater|erosion/)) {
      skills.add('Soil Mechanics');
      skills.add('Agriculture');
      skills.add('Drones');
      classification = 'Agricultural & Land Resource Management';
      sdg_target = 2; // SDG 2: Zero Hunger
    }

    // Default general skills if no specific keyword triggered
    if (skills.size === 0) {
      skills.add('Civil Engineering');
      skills.add('IoT');
      skills.add('Sensors');
      skills.add('Roads');
    }

    return {
      skills: Array.from(skills),
      classification,
      sdg_target,
    };
  }

  /**
   * Evaluates match score between complaint extracted skills and university lab capabilities
   */
  async getMatchesForComplaint(complaintId: string): Promise<ComplaintMatchingResponse> {
    // 1. Fetch Complaint by ID or complaintNumber
    const complaint = await this.prisma.complaint.findFirst({
      where: {
        OR: [{ id: complaintId }, { complaintNumber: complaintId }],
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with identifier "${complaintId}" was not found.`);
    }

    // 2. Parse or extract required engineering skills and AI triage fields
    let extracted_skills: string[] = [];
    const rawSkills = complaint.extracted_skills || (complaint as any).extractedSkills;

    if (rawSkills) {
      try {
        extracted_skills = JSON.parse(rawSkills);
      } catch {
        extracted_skills = rawSkills.split(',').map((s: string) => s.trim());
      }
    }

    let classification = complaint.classification;
    let sdg_target = complaint.sdg_target;

    if (!extracted_skills || extracted_skills.length === 0) {
      const triage = this.extractSkillsFromComplaint(
        complaint.title,
        complaint.description,
        complaint.category,
      );
      extracted_skills = triage.skills;
      classification = classification || triage.classification;
      sdg_target = sdg_target || triage.sdg_target;

      // Cache extracted skills, classification, and sdg_target back onto complaint record
      await this.prisma.complaint.update({
        where: { id: complaint.id },
        data: {
          extracted_skills: JSON.stringify(extracted_skills),
          classification,
          sdg_target,
        },
      });
    }

    this.logger.log(`Extracted skills for complaint ${complaint.complaintNumber}: ${extracted_skills.join(', ')}`);

    // 3. Fetch all universities from database
    const universities = await this.prisma.university.findMany();

    // 4. Calculate skill overlap and match score for each university
    const scoredMatches: UniversityMatchResult[] = universities.map((uni) => {
      let capabilities: string[] = [];
      try {
        capabilities = JSON.parse(uni.capabilities);
      } catch {
        capabilities = uni.capabilities.split(',').map((c) => c.trim());
      }

      // Check overlap between extracted skills and university capabilities
      const matchedCapabilities: string[] = [];

      for (const skill of extracted_skills) {
        const matchingCap = capabilities.find(
          (cap) =>
            cap.toLowerCase() === skill.toLowerCase() ||
            cap.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(cap.toLowerCase()),
        );

        if (matchingCap && !matchedCapabilities.includes(matchingCap)) {
          matchedCapabilities.push(matchingCap);
        }
      }

      // Calculate Match Score percentage (0% to 100%)
      const overlapRatio = extracted_skills.length > 0
        ? matchedCapabilities.length / extracted_skills.length
        : 0;

      let matchPercentage = Math.round(overlapRatio * 100);
      if (matchedCapabilities.length > 0 && matchPercentage < 40) {
        matchPercentage = 50; // Base boost for at least 1 verified lab capability
      }

      // Generated explanation string matching hackathon format
      let explanation: string;
      if (matchedCapabilities.length > 0) {
        explanation = `Matched because of overlap in ${matchedCapabilities.join(', ')} (${matchPercentage}% Match)`;
      } else {
        explanation = `10% Baseline: General academic engineering department`;
      }

      return {
        universityId: uni.id,
        name: uni.name,
        location: uni.location,
        capabilities,
        matchedCapabilities,
        score: matchedCapabilities.length,
        matchPercentage,
        explanation,
      };
    });

    // 5. Sort by highest match score & percentage descending, return top 3
    scoredMatches.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchPercentage - a.matchPercentage;
    });

    const topMatches = scoredMatches.slice(0, 3);

    return {
      complaintId: complaint.id,
      complaintNumber: complaint.complaintNumber,
      title: complaint.title,
      category: complaint.category,
      classification,
      sdg_target,
      extracted_skills,
      matches: topMatches,
    };
  }

  /**
   * Fetches incoming INNOVATION complaints for a university inbox,
   * scored against the university's lab capabilities, sorted descending by match score.
   */
  async getUniversityInbox(universityId: string) {
    // 1. Fetch university
    const university = await this.prisma.university.findFirst({
      where: {
        OR: [{ id: universityId }, { name: universityId }],
      },
    });

    if (!university) {
      throw new NotFoundException(`University "${universityId}" not found.`);
    }

    let uniCapabilities: string[] = [];
    try {
      uniCapabilities = JSON.parse(university.capabilities);
    } catch {
      uniCapabilities = university.capabilities.split(',').map((c) => c.trim());
    }

    // 2. Return all complaints where status === 'SUBMITTED' regardless of AI tagging:
    const complaints = await this.prisma.complaint.findMany({
      where: {
        status: 'SUBMITTED',
      },
      include: {
        assignedUniversity: true,
        citizen: true,
        industryPartner: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Score complaints against university capabilities
    const inboxItems: any[] = [];

    for (const complaint of complaints) {
      let extracted_skills: string[] = [];
      const rawSkills = complaint.extracted_skills;
      if (rawSkills) {
        try {
          extracted_skills = JSON.parse(rawSkills);
        } catch {
          extracted_skills = rawSkills.split(',').map((s) => s.trim());
        }
      }

      let classification = complaint.classification || 'INNOVATION';
      let sdg_target = complaint.sdg_target;

      if (!extracted_skills || extracted_skills.length === 0) {
        const triage = this.extractSkillsFromComplaint(
          complaint.title,
          complaint.description,
          complaint.category,
        );
        extracted_skills = triage.skills;
        sdg_target = sdg_target || triage.sdg_target;
      }

      // Calculate skill overlap for this university
      const matchedCapabilities: string[] = [];
      for (const skill of extracted_skills) {
        const match = uniCapabilities.find(
          (cap) =>
            cap.toLowerCase() === skill.toLowerCase() ||
            cap.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(cap.toLowerCase()),
        );
        if (match && !matchedCapabilities.includes(match)) {
          matchedCapabilities.push(match);
        }
      }

      const overlapRatio =
        extracted_skills.length > 0 ? matchedCapabilities.length / extracted_skills.length : 0;
      let matchPercentage = Math.round(overlapRatio * 100);
      if (matchedCapabilities.length > 0 && matchPercentage < 40) {
        matchPercentage = 50;
      }

      let explanation: string;
      if (matchedCapabilities.length > 0) {
        explanation = `Matched because of overlap in ${matchedCapabilities.join(', ')} (${matchPercentage}% Match)`;
      } else {
        explanation = `10% Baseline: General academic engineering department`;
      }

      inboxItems.push({
        id: complaint.id,
        complaintNumber: complaint.complaintNumber,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        status: complaint.status,
        priority: complaint.priority,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        classification: 'INNOVATION',
        sdg_target: sdg_target || 6,
        extracted_skills,
        createdAt: complaint.createdAt,
        citizen: complaint.citizen,
        assignedUniversity: complaint.assignedUniversity,
        industryPartner: complaint.industryPartner,
        // Match metrics for this specific university
        matchScore: matchedCapabilities.length,
        matchPercentage,
        matchedCapabilities,
        explanation,
        universityId: university.id,
        universityName: university.name,
      });
    }

    // 4. Sort descending so highest match appears at the very top
    inboxItems.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.matchPercentage - a.matchPercentage;
    });

    return inboxItems;
  }
}
