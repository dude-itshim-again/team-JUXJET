import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Challenge,
  Project,
  Institution,
  Department,
  IndustryPartner,
  Notification,
  AuditLog,
  ChallengeStatus,
  Priority,
  Task,
  Deliverable,
  TestRecord,
  InnovationOutcome
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CHALLENGES,
  INITIAL_PROJECTS,
  INITIAL_INSTITUTIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  currentRole: Role | 'public';
  loginAs: (role: Role | 'public') => void;
  loginWithPhone: (
    phone: string,
    role: Role,
    profile?: {
      name?: string;
      age?: number;
      email?: string;
      district?: string;
      cityVillage?: string;
      institutionName?: string;
      departmentName?: string;
      organizationName?: string;
      designation?: string;
    }
  ) => void;
  logout: () => void;

  challenges: Challenge[];
  projects: Project[];
  institutions: Institution[];
  departments: Department[];
  industryPartners: IndustryPartner[];
  notifications: Notification[];
  auditLogs: AuditLog[];

  // Challenge Actions
  addChallenge: (challengeData: Partial<Challenge>) => Challenge;
  validateChallenge: (
    challengeId: string,
    action: 'Validate' | 'Reject' | 'RequestInfo' | 'Duplicate',
    data: {
      category?: Challenge['category'];
      priority?: Priority;
      department?: string;
      notes?: string;
    }
  ) => void;
  routeChallengeToUniversity: (challengeId: string, institutionId: string) => void;
  acceptChallengeAssignment: (challengeId: string, universityId: string) => void;
  toggleUpvote: (challengeId: string) => void;
  addComment: (challengeId: string, text: string) => void;

  // Project Actions
  createProjectFromChallenge: (challengeId: string, teamData: Partial<Project>) => Project;
  updateProjectTask: (projectId: string, task: Task) => void;
  addProjectTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  updateMilestoneStatus: (projectId: string, milestoneId: string, status: any, feedback?: string) => void;
  addDeliverable: (projectId: string, deliverable: Omit<Deliverable, 'id' | 'submittedAt'>) => void;
  addTestRecord: (projectId: string, testRecord: Omit<TestRecord, 'id'>) => void;
  addInnovationOutcome: (projectId: string, outcome: Omit<InnovationOutcome, 'id'>) => void;
  addIndustryPledge: (projectId: string, partnerName: string, type: any, pledge: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Admin / State
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SCOPE: 'samadhansetu_scope',
  USER: 'samadhansetu_user',
  CHALLENGES: 'samadhansetu_challenges',
  PROJECTS: 'samadhansetu_projects',
  NOTIFICATIONS: 'samadhansetu_notifications',
  AUDIT: 'samadhansetu_audit_logs'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isJharkhandScope = localStorage.getItem(STORAGE_KEYS.SCOPE) === 'jharkhand-v1';

  // Current user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved && isJharkhandScope) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (saved && isJharkhandScope) {
      try {
        const savedChallenges = JSON.parse(saved) as Challenge[];
        if (savedChallenges.every(challenge => challenge.location?.state === 'Jharkhand')) {
          return savedChallenges;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHALLENGES;
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved && isJharkhandScope) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved && isJharkhandScope) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved && isJharkhandScope) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCOPE, 'jharkhand-v1');
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth Helpers
  const loginAs = (role: Role | 'public') => {
    if (role === 'public') {
      setCurrentUser(null);
    } else {
      setCurrentUser(INITIAL_USERS[role] || INITIAL_USERS.citizen);
    }
  };

  const loginWithPhone = (
    phone: string,
    role: Role,
    profile?: {
      name?: string;
      age?: number;
      email?: string;
      district?: string;
      cityVillage?: string;
      institutionName?: string;
      departmentName?: string;
      organizationName?: string;
      designation?: string;
    }
  ) => {
    const baseUser = INITIAL_USERS[role] || INITIAL_USERS.citizen;
    const user: User = {
      ...baseUser,
      id: profile?.name ? `USR-${role.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}` : baseUser.id,
      role,
      name: profile?.name?.trim() || baseUser.name,
      age: profile?.age !== undefined ? profile.age : baseUser.age,
      phone: phone || baseUser.phone,
      email: profile?.email?.trim() || baseUser.email,
      institutionName: profile?.institutionName?.trim() || baseUser.institutionName,
      departmentName: profile?.departmentName?.trim() || baseUser.departmentName,
      organizationName: profile?.organizationName?.trim() || baseUser.organizationName,
      designation: profile?.designation?.trim() || baseUser.designation,
      location: {
        ...baseUser.location,
        district: profile?.district?.trim() || baseUser.location.district,
        cityVillage: profile?.cityVillage?.trim() || baseUser.location.cityVillage
      },
      verified: true,
      joinedAt: baseUser.joinedAt || new Date().toISOString().split('T')[0]
    };
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.SCOPE, 'jharkhand-v1');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const currentRole: Role | 'public' = currentUser ? currentUser.role : 'public';

  const logAudit = (action: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser ? currentUser.name : 'System/Anonymous',
      actorRole: currentUser ? currentUser.role : 'citizen',
      action,
      targetId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Challenge Logic
  const addChallenge = (data: Partial<Challenge>): Challenge => {
    const id = data.id || data.complaintNumber || `CHAL-2026-${String(challenges.length + 1).padStart(3, '0')}`;
    const newChallenge: Challenge = {
      ...data,
      id,
      backendId: data.backendId || id,
      complaintNumber: data.complaintNumber || id,
      title: data.title || 'Untitled Community Challenge',
      description: data.description || '',
      whoIsAffected: data.whoIsAffected || 'Local residents',
      durationExisted: data.durationExisted || 'Recent issue',
      category: data.category || 'Water and Sanitation',
      subcategory: data.subcategory || '',
      tags: data.tags || ['Community', 'CivicTech'],
      sdgGoals: data.sdgGoals || [6],
      priority: data.priority || 'Medium',
      status: data.status || 'Submitted',
      location: data.location || {
        state: 'Jharkhand',
        district: 'Ranchi',
        pincode: '834001',
        address: 'Ranchi, Jharkhand',
        lat: 23.3441,
        lng: 85.3096
      },
      evidence: data.evidence || [],
      impact: data.impact || {
        affectedPeopleCount: 500,
        affectedCommunity: 'Local locality',
        severity: 'Moderate',
        urgency: 'Medium',
        frequency: 'Continuous',
        potentialBeneficiaries: '1000'
      },
      privacy: data.privacy || {
        visibility: 'Public',
        isAnonymous: false,
        contactPreference: 'Phone',
        shareConsent: true,
        accuracyDeclaration: true
      },
      submittedBy: {
        id: currentUser ? currentUser.id : 'USR-CIT-001',
        name: currentUser ? currentUser.name : 'Anonymous Citizen',
        phone: currentUser ? currentUser.phone : '+91 98765 00000',
        isAnonymous: data.privacy?.isAnonymous || false
      },
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          label: 'Challenge Submitted by Citizen',
          timestamp: new Date().toISOString(),
          actor: currentUser ? currentUser.name : 'Citizen',
          actorRole: 'citizen',
          notes: 'Received in portal. Pending government validation triage.'
        }
      ],
      aiAnalysis: {
        suggestedCategory: data.category || 'Water and Sanitation',
        categoryConfidence: 94,
        suggestedPriority: data.priority || 'Medium',
        priorityRationale: 'Simulated AI natural language triage identified community distress keywords and environmental vulnerability indicators.',
        sdgAlignments: ['SDG 6: Clean Water', 'SDG 11: Sustainable Communities'],
        duplicateSimilarityScore: 6,
        missingInformationFlags: [],
        recommendedUniversities: [
          {
            institutionId: 'INST-001',
            institutionName: 'BIT Mesra',
            matchScore: 92,
            matchReason: 'Domain expertise in field solutions matching the problem sector.',
            facilities: ['Advanced Testing Labs']
          }
        ],
        suggestedDepartment: 'Department of Drinking Water & Sanitation',
        status: 'Pending Review'
      },
      upvotes: 1,
      upvotedByUserIds: [currentUser ? currentUser.id : 'USR-CIT-001'],
      followersCount: 1,
      comments: []
    };

    setChallenges(prev => [newChallenge, ...prev]);

    // Send notification to Government
    const notif: Notification = {
      id: `NOTIF-${Date.now()}`,
      recipientRole: 'government',
      title: 'New Challenge Submitted for Validation',
      message: `${newChallenge.title.substring(0, 50)}... received in ${newChallenge.location.district}`,
      link: '/government/validation',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('SUBMIT_CHALLENGE', id, `Citizen submitted new challenge "${newChallenge.title}"`);
    return newChallenge;
  };

  const validateChallenge = (
    challengeId: string,
    action: 'Validate' | 'Reject' | 'RequestInfo' | 'Duplicate',
    data: {
      category?: Challenge['category'];
      priority?: Priority;
      department?: string;
      notes?: string;
    }
  ) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;

        let newStatus: ChallengeStatus = 'Validated';
        let statusLabel = 'Validated by Government Officer';

        if (action === 'Reject') {
          newStatus = 'Rejected';
          statusLabel = 'Challenge Rejected by Reviewer';
        } else if (action === 'RequestInfo') {
          newStatus = 'Additional Info Required';
          statusLabel = 'Additional Information Requested from Citizen';
        } else if (action === 'Duplicate') {
          newStatus = 'Duplicate Linked';
          statusLabel = 'Linked as Duplicate Challenge';
        }

        const newTimelineEvent = {
          status: newStatus,
          label: statusLabel,
          timestamp: new Date().toISOString(),
          actor: currentUser ? currentUser.name : 'Authorized Officer',
          actorRole: 'government' as Role,
          notes: data.notes || `Validation decision: ${action}`
        };

        return {
          ...ch,
          status: newStatus,
          category: data.category || ch.category,
          priority: data.priority || ch.priority,
          assignedDepartment: data.department || ch.assignedDepartment,
          updatedAt: new Date().toISOString(),
          timeline: [...ch.timeline, newTimelineEvent]
        };
      })
    );

    // Notify Citizen
    const targetChallenge = challenges.find(c => c.id === challengeId);
    if (targetChallenge) {
      const notif: Notification = {
        id: `NOTIF-${Date.now()}`,
        recipientRole: 'citizen',
        recipientId: targetChallenge.submittedBy.id,
        title: action === 'Validate' ? 'Your Challenge has been Validated! ✅' : `Update on your challenge: ${action}`,
        message: `Government reviewer updated status to: ${action}. ${data.notes || ''}`,
        link: `/citizen/challenges/${challengeId}`,
        type: action === 'Validate' ? 'success' : 'alert',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    logAudit(`VALIDATE_${action.toUpperCase()}`, challengeId, `Officer marked challenge as ${action}. Notes: ${data.notes || 'None'}`);
  };

  const routeChallengeToUniversity = (challengeId: string, institutionId: string) => {
    const institution = INITIAL_INSTITUTIONS.find(i => i.id === institutionId);
    if (!institution) return;

    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return {
          ...ch,
          status: 'Assigned to University',
          assignedUniversity: {
            institutionId: institution.id,
            institutionName: institution.name,
            assignedDate: new Date().toISOString().split('T')[0],
            status: 'Invited'
          },
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ch.timeline,
            {
              status: 'Assigned to University',
              label: `Routed & Invited: ${institution.name}`,
              timestamp: new Date().toISOString(),
              actor: currentUser ? currentUser.name : 'Government Mission Officer',
              actorRole: 'government',
              notes: `Institutional invitation dispatched to ${institution.name} based on AI domain capability match.`
            }
          ]
        };
      })
    );

    // Notify University
    const notif: Notification = {
      id: `NOTIF-${Date.now()}`,
      recipientRole: 'university',
      title: 'New Societal Challenge Routed to Your Institution',
      message: `Ministry routed challenge "${challenges.find(c => c.id === challengeId)?.title}" to ${institution.name}`,
      link: '/university/discover',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('ROUTE_UNIVERSITY', challengeId, `Challenge routed to ${institution.name}`);
  };

  const acceptChallengeAssignment = (challengeId: string, universityId: string) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return {
          ...ch,
          status: 'Project Initiated',
          assignedUniversity: ch.assignedUniversity ? {
            ...ch.assignedUniversity,
            status: 'Accepted'
          } : undefined,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ch.timeline,
            {
              status: 'Project Initiated',
              label: 'University Accepted Assignment',
              timestamp: new Date().toISOString(),
              actor: currentUser ? currentUser.name : 'University Dean R&D',
              actorRole: 'university',
              notes: 'Institution confirmed intent to assemble multidisciplinary problem-solving team.'
            }
          ]
        };
      })
    );

    logAudit('ACCEPT_ASSIGNMENT', challengeId, `University accepted challenge`);
  };

  const toggleUpvote = (challengeId: string) => {
    const userId = currentUser ? currentUser.id : 'ANON';
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        const alreadyUpvoted = ch.upvotedByUserIds.includes(userId);
        return {
          ...ch,
          upvotes: alreadyUpvoted ? ch.upvotes - 1 : ch.upvotes + 1,
          upvotedByUserIds: alreadyUpvoted
            ? ch.upvotedByUserIds.filter(id => id !== userId)
            : [...ch.upvotedByUserIds, userId]
        };
      })
    );
  };

  const addComment = (challengeId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `COM-${Date.now()}`,
      userId: currentUser ? currentUser.id : 'ANON',
      userName: currentUser ? currentUser.name : 'Civic Member',
      userRole: (currentUser ? currentUser.role : 'citizen') as Role,
      text,
      createdAt: new Date().toISOString(),
      isOfficial: currentUser ? currentUser.role === 'government' || currentUser.role === 'university' : false
    };

    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return {
          ...ch,
          comments: [...ch.comments, newComment]
        };
      })
    );
  };

  // Project Logic
  const createProjectFromChallenge = (challengeId: string, data: Partial<Project>): Project => {
    const targetChallenge = challenges.find(c => c.id === challengeId);
    const newId = `PROJ-2026-${String(projects.length + 1).padStart(3, '0')}`;

    const newProject: Project = {
      id: newId,
      title: data.title || `Innovative Solution for ${targetChallenge?.title.substring(0, 40) || 'Challenge'}`,
      challengeId,
      challengeTitle: targetChallenge?.title || '',
      category: targetChallenge?.category || 'Water and Sanitation',
      universityId: currentUser?.institutionId || 'INST-001',
      universityName: currentUser?.institutionName || 'BIT Mesra',
      teamName: data.teamName || 'Multidisciplinary Innovation Team',
      facultyMentor: data.facultyMentor || {
        id: 'FM-999',
        name: currentUser?.name || 'Prof. Faculty Mentor',
        department: 'Engineering',
        designation: 'Lead Faculty Advisor',
        email: currentUser?.email || 'mentor@univ.edu',
        specialization: 'Applied Innovations'
      },
      studentTeam: data.studentTeam || [
        {
          id: 'STU-101',
          name: 'Student Lead',
          discipline: 'Engineering',
          role: 'Project Lead',
          email: 'lead@student.univ.edu'
        }
      ],
      stage: 'Planning',
      progressPercentage: 15,
      proposal: data.proposal || {
        problemStatement: targetChallenge?.description || '',
        proposedSolution: 'Field-tested prototype combining low-cost physical remediation with automated telemetry.',
        technicalMethodology: 'Agile sprints with local community participation and certified laboratory test verification.',
        requiredBudget: 350000,
        durationMonths: 4,
        riskAssessment: 'Slight supply chain delays for imported sensors; mitigated by local sourcing.',
        societalImpactProjected: `Direct benefit to ${targetChallenge?.impact.affectedPeopleCount || 1000} residents.`,
        sustainabilityPlan: 'Gram Panchayat ownership model with local youth operators.',
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Submitted'
      },
      budget: {
        requested: 350000,
        approved: 350000,
        spent: 45000,
        csrPledged: 0
      },
      industryPartners: [],
      tasks: [
        {
          id: `TSK-${Date.now()}-1`,
          title: 'Field site survey and ground sample gathering',
          assignedTo: 'Student Lead',
          priority: 'High',
          status: 'Done',
          dueDate: '2026-03-01'
        },
        {
          id: `TSK-${Date.now()}-2`,
          title: 'Initial benchtop prototype CAD schematic',
          assignedTo: 'Student Lead',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: '2026-03-15'
        }
      ],
      milestones: [
        {
          id: `MS-${Date.now()}-1`,
          title: 'Milestone 1: Proof of Concept & Lab Test Pass',
          description: 'Pass official parameter test in university research laboratory.',
          stage: 'Prototype',
          dueDate: '2026-03-20',
          status: 'In Progress',
          deliverables: ['Lab Test Certificate']
        },
        {
          id: `MS-${Date.now()}-2`,
          title: 'Milestone 2: Field Pilot Deployment',
          description: 'Install operational pilot at citizen challenge site for 30-day trial.',
          stage: 'Pilot',
          dueDate: '2026-04-15',
          status: 'Pending',
          deliverables: ['Pilot Installation Report']
        }
      ],
      deliverables: [],
      testRecords: [],
      outcomes: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProject, ...prev]);

    // Link challenge
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        return {
          ...ch,
          linkedProjectId: newId,
          status: 'In Progress'
        };
      })
    );

    logAudit('CREATE_PROJECT', newId, `University created project team for challenge ${challengeId}`);
    return newProject;
  };

  const updateProjectTask = (projectId: string, task: Task) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.map(t => (t.id === task.id ? task : t)),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addProjectTask = (projectId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `TSK-${Date.now()}`
    };
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: [...p.tasks, newTask],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const updateMilestoneStatus = (projectId: string, milestoneId: string, status: any, feedback?: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              status,
              feedback: feedback || m.feedback,
              completedDate: status === 'Approved' ? new Date().toISOString().split('T')[0] : m.completedDate
            };
          }),
          progressPercentage: Math.min(100, p.progressPercentage + (status === 'Approved' ? 25 : 5)),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addDeliverable = (projectId: string, deliverable: Omit<Deliverable, 'id' | 'submittedAt'>) => {
    const newDeliv: Deliverable = {
      ...deliverable,
      id: `DEL-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          deliverables: [...p.deliverables, newDeliv],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addTestRecord = (projectId: string, testRecord: Omit<TestRecord, 'id'>) => {
    const newTest: TestRecord = {
      ...testRecord,
      id: `TR-${Date.now()}`
    };
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          testRecords: [...p.testRecords, newTest],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addInnovationOutcome = (projectId: string, outcome: Omit<InnovationOutcome, 'id'>) => {
    const newOutcome: InnovationOutcome = {
      ...outcome,
      id: `OUT-${Date.now()}`
    };
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          outcomes: [...p.outcomes, newOutcome],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addIndustryPledge = (projectId: string, partnerName: string, type: any, pledge: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          industryPartners: [
            ...p.industryPartners,
            {
              partnerId: `PART-${Date.now()}`,
              partnerName,
              partnershipType: type,
              pledgeDescription: pledge,
              status: 'Active'
            }
          ],
          budget: {
            ...p.budget,
            csrPledged: p.budget.csrPledged + (type === 'CSR Funding' ? 200000 : 0)
          }
        };
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS.citizen);
    setChallenges(INITIAL_CHALLENGES);
    setProjects(INITIAL_PROJECTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        loginAs,
        loginWithPhone,
        logout,
        challenges,
        projects,
        institutions: INITIAL_INSTITUTIONS,
        departments: INITIAL_DEPARTMENTS,
        industryPartners: INITIAL_INDUSTRY_PARTNERS,
        notifications,
        auditLogs,
        addChallenge,
        validateChallenge,
        routeChallengeToUniversity,
        acceptChallengeAssignment,
        toggleUpvote,
        addComment,
        createProjectFromChallenge,
        updateProjectTask,
        addProjectTask,
        updateMilestoneStatus,
        addDeliverable,
        addTestRecord,
        addInnovationOutcome,
        addIndustryPledge,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
