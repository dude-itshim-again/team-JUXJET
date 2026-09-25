export type Role = 'citizen' | 'university' | 'government' | 'industry';

export interface User {
  id: string;
  name: string;
  age?: number;
  phone: string;
  email?: string;
  role: Role;
  avatar?: string;
  verified: boolean;
  institutionId?: string;
  institutionName?: string;
  departmentId?: string;
  departmentName?: string;
  organizationName?: string;
  designation?: string;
  location: {
    state: string;
    district: string;
    cityVillage?: string;
  };
  joinedAt: string;
}

export type ChallengeCategory =
  | 'Water and Sanitation'
  | 'Healthcare'
  | 'Agriculture'
  | 'Education'
  | 'Rural Development'
  | 'Urban Infrastructure'
  | 'Environment and Climate'
  | 'Renewable Energy'
  | 'Waste Management'
  | 'Transportation'
  | 'Public Safety'
  | 'Accessibility'
  | 'Digital Governance'
  | 'Livelihoods'
  | 'Other';

export type ChallengeStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Validation'
  | 'Additional Info Required'
  | 'Validated'
  | 'Assigned to University'
  | 'Project Initiated'
  | 'In Progress'
  | 'Pilot'
  | 'Implemented'
  | 'Completed'
  | 'Rejected'
  | 'Duplicate Linked'
  | 'On Hold';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ChallengeEvidence {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  caption?: string;
  uploadedAt: string;
}

export interface ChallengeLocation {
  state: string;
  district: string;
  talukaBlock?: string;
  villageWard?: string;
  locality?: string;
  pincode: string;
  address: string;
  lat: number;
  lng: number;
}

export interface ChallengeImpact {
  affectedPeopleCount: number;
  affectedCommunity: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Life-Threatening';
  urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
  frequency: 'Occasional' | 'Seasonal' | 'Continuous' | 'Worsening';
  potentialBeneficiaries: string;
  existingAttempts?: string;
  suggestedSolution?: string;
}

export interface ChallengePrivacy {
  visibility: 'Public' | 'Restricted';
  isAnonymous: boolean;
  contactPreference: 'Phone' | 'Email' | 'Portal Only';
  shareConsent: boolean;
  accuracyDeclaration: boolean;
}

export interface TimelineEvent {
  status: ChallengeStatus;
  label: string;
  timestamp: string;
  actor: string;
  actorRole: Role;
  notes?: string;
}

export interface AIAnalysis {
  suggestedCategory: ChallengeCategory;
  categoryConfidence: number; // 0-100
  suggestedPriority: Priority;
  priorityRationale: string;
  sdgAlignments: string[];
  duplicateSimilarityScore: number; // 0-100
  duplicateCandidateIds?: string[];
  missingInformationFlags: string[];
  recommendedUniversities: {
    institutionId: string;
    institutionName: string;
    matchScore: number;
    matchReason: string;
    facilities: string[];
  }[];
  suggestedDepartment: string;
  status: 'Pending Review' | 'Accepted' | 'Overridden';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  whoIsAffected: string;
  durationExisted: string;
  category: ChallengeCategory;
  subcategory?: string;
  tags: string[];
  sdgGoals: number[];
  priority: Priority;
  status: ChallengeStatus;
  location: ChallengeLocation;
  evidence: ChallengeEvidence[];
  impact: ChallengeImpact;
  privacy: ChallengePrivacy;
  submittedBy: {
    id: string;
    name: string;
    phone: string;
    isAnonymous: boolean;
  };
  submittedAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  aiAnalysis?: AIAnalysis;
  assignedDepartment?: string;
  assignedUniversity?: {
    institutionId: string;
    institutionName: string;
    assignedDate: string;
    status: 'Invited' | 'Accepted' | 'Declined';
    leadFaculty?: string;
  };
  linkedProjectId?: string;
  upvotes: number;
  upvotedByUserIds: string[];
  followersCount: number;
  comments: ChallengeComment[];
  internalGovNotes?: string[];
  // AI Triage & Backend Integration
  classification?: string;
  sdg_target?: number;
  extracted_skills?: string[];
  complaintNumber?: string;
}

export interface UniversityMatch {
  universityId: string;
  name: string;
  location: string;
  capabilities: string[];
  matchedCapabilities: string[];
  score: number;
  matchPercentage: number;
  explanation: string;
}

export interface ComplaintMatchesResponse {
  complaintId: string;
  complaintNumber: string;
  title: string;
  category: string;
  classification: string;
  sdg_target: number;
  extracted_skills: string[];
  matches: UniversityMatch[];
}

export interface ChallengeComment {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  avatar?: string;
  text: string;
  createdAt: string;
  isOfficial?: boolean;
}

export type ProjectStage =
  | 'Draft'
  | 'Submitted'
  | 'Under Evaluation'
  | 'Approved'
  | 'Planning'
  | 'Active Development'
  | 'Prototype'
  | 'Testing'
  | 'Pilot'
  | 'Implementation'
  | 'Technology Transfer'
  | 'Completed'
  | 'On Hold';

export interface StudentMember {
  id: string;
  name: string;
  discipline: string;
  role: string;
  email: string;
}

export interface FacultyMentor {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  specialization: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  stage: ProjectStage;
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Approved' | 'Revision Requested';
  deliverables: string[];
  feedback?: string;
  approvedBy?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  milestoneId: string;
  submittedBy: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  summary: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Changes Needed';
}

export interface TestRecord {
  id: string;
  testName: string;
  date: string;
  parameters: string;
  result: 'Passed' | 'Conditional Pass' | 'Failed';
  metrics: string;
  notes: string;
}

export interface PilotRecord {
  id: string;
  location: string;
  beneficiariesCount: number;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'Monitoring';
  feedbackSummary: string;
  verifiedOutcomes: string[];
}

export interface InnovationOutcome {
  id: string;
  type: 'Patent Filed' | 'Patent Granted' | 'Publication' | 'Startup Incubated' | 'Open Source Tech' | 'Govt Deployment';
  title: string;
  referenceNo?: string;
  date: string;
  verified: boolean;
  description: string;
}

export interface ProjectProposal {
  problemStatement: string;
  proposedSolution: string;
  technicalMethodology: string;
  requiredBudget: number;
  durationMonths: number;
  riskAssessment: string;
  societalImpactProjected: string;
  sustainabilityPlan: string;
  submittedAt: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revision Requested';
  reviewerFeedback?: string;
}

export interface Project {
  id: string;
  title: string;
  challengeId: string;
  challengeTitle: string;
  category: ChallengeCategory;
  universityId: string;
  universityName: string;
  facultyMentor: FacultyMentor;
  studentTeam: StudentMember[];
  teamName: string;
  stage: ProjectStage;
  progressPercentage: number;
  proposal: ProjectProposal;
  budget: {
    requested: number;
    approved: number;
    spent: number;
    csrPledged: number;
  };
  industryPartners: {
    partnerId: string;
    partnerName: string;
    partnershipType: 'Mentorship' | 'CSR Funding' | 'Equipment Access' | 'Pilot Co-Development';
    pledgeDescription: string;
    status: 'Proposed' | 'Active' | 'Completed';
  }[];
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  testRecords: TestRecord[];
  pilotRecord?: PilotRecord;
  outcomes: InnovationOutcome[];
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'IIT' | 'NIT' | 'Central University' | 'State University' | 'Private University' | 'Research Lab';
  state: string;
  city: string;
  nirfRank?: number;
  departments: string[];
  equipmentLabs: string[];
  facultyCount: number;
  studentInnovatorsCount: number;
  activeProjectsCount: number;
  verified: boolean;
  contactEmail: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  type: 'Enterprise' | 'Startup' | 'MSME' | 'CSR Foundation' | 'Incubator';
  sector: string;
  headquarters: string;
  csrFocusAreas: string[];
  totalGrantsPledged: number;
  activeCollaborationsCount: number;
  verified: boolean;
}

export interface Department {
  id: string;
  name: string;
  ministry: string;
  state: string;
  activeChallengesCount: number;
  resolvedCount: number;
  officersCount: number;
  avgTurnaroundDays: number;
}

export interface Notification {
  id: string;
  recipientRole: Role;
  recipientId?: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface Grievance {
  id: string;
  challengeId?: string;
  citizenName: string;
  phone: string;
  subject: string;
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  submittedAt: string;
  response?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: Role;
  action: string;
  targetId: string;
  details: string;
}
