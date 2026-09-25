import { Challenge, Project, Institution, Department, IndustryPartner, User, Notification, AuditLog } from '../types';

export const INITIAL_USERS: Record<string, User> = {
  citizen: {
    id: 'USR-CIT-001',
    name: 'Ramesh Verma',
    phone: '+91 98765 43210',
    email: 'ramesh.verma@example.com',
    role: 'citizen',
    verified: true,
    location: {
      state: 'Jharkhand',
      district: 'Ranchi',
      cityVillage: 'Kanke Village'
    },
    joinedAt: '2026-01-15'
  },
  university: {
    id: 'USR-UNI-001',
    name: 'Prof. Sunita Rao',
    phone: '+91 94123 45678',
    email: 's.rao@iitd.ac.in',
    role: 'university',
    verified: true,
    institutionId: 'INST-001',
    institutionName: 'Birla Institute of Technology (BIT) Mesra',
    designation: 'Professor & Dean of R&D, Environmental Engineering',
    location: {
      state: 'Jharkhand',
      district: 'Ranchi'
    },
    joinedAt: '2025-11-10'
  },
  government: {
    id: 'USR-GOV-001',
    name: 'Rajesh Kumar, IAS',
    phone: '+91 98111 22334',
    email: 'rajesh.kumar@nic.in',
    role: 'government',
    verified: true,
    departmentId: 'DEPT-001',
    departmentName: 'Department of Drinking Water & Sanitation (Jal Jeevan Mission)',
    designation: 'Joint Secretary & Mission Director',
    location: {
      state: 'Jharkhand',
      district: 'Dhanbad'
    },
    joinedAt: '2025-08-01'
  },
  industry: {
    id: 'USR-IND-001',
    name: 'Ananya Sen',
    phone: '+91 99887 76655',
    email: 'ananya.sen@tatatrusts.org',
    role: 'industry',
    verified: true,
    organizationName: 'Tata Community Initiatives Trust (CSR)',
    designation: 'Head of Sustainable Water Initiatives',
    location: {
      state: 'Jharkhand',
      district: 'Jamshedpur'
    },
    joinedAt: '2025-12-01'
  }
};

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'INST-001',
    name: 'Birla Institute of Technology (BIT) Mesra',
    type: 'IIT',
    state: 'Jharkhand',
    city: 'Ranchi',
    nirfRank: 2,
    departments: ['Environmental Engineering', 'Chemical Engineering', 'Computer Science', 'Biochemical Engineering'],
    equipmentLabs: ['Advanced Water Testing & Spectrophotometry Lab', 'IoT & Embedded Sensors Fab', 'CleanTech Prototyping Workshop'],
    facultyCount: 680,
    studentInnovatorsCount: 3400,
    activeProjectsCount: 14,
    verified: true,
    contactEmail: 'rnd@iitd.ac.in'
  },
  {
    id: 'INST-002',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    type: 'NIT',
    state: 'Jharkhand',
    city: 'Jamshedpur',
    nirfRank: 9,
    departments: ['Mechanical Engineering', 'Instrumentation and Control', 'Civil Engineering'],
    equipmentLabs: ['Renewable Microgrid Testing Bed', 'Heavy Prototyping Facility', 'Rural Tech Center'],
    facultyCount: 420,
    studentInnovatorsCount: 2200,
    activeProjectsCount: 8,
    verified: true,
    contactEmail: 'director@nitt.edu'
  },
  {
    id: 'INST-003',
    name: 'Birsa Agricultural University (BAU)',
    type: 'State University',
    state: 'Jharkhand',
    city: 'Ranchi',
    nirfRank: 28,
    departments: ['Agronomy', 'Soil & Water Engineering', 'Farm Power & Machinery', 'Biotechnology'],
    equipmentLabs: ['Bio-Pelletization & Pyrolysis Plant', 'Precision Agriculture Drones Lab', 'Crop Pathology Center'],
    facultyCount: 350,
    studentInnovatorsCount: 1800,
    activeProjectsCount: 11,
    verified: true,
    contactEmail: 'research@pau.edu'
  },
  {
    id: 'INST-004',
    name: 'Amity University Jharkhand',
    type: 'Private University',
    state: 'Jharkhand',
    city: 'Ranchi',
    nirfRank: 20,
    departments: ['Electrical & Electronics', 'Pharmacy & Health Tech', 'Computer Science'],
    equipmentLabs: ['Telemedicine IoT Testing Lab', 'Rapid 3D Prototyping Cleanroom'],
    facultyCount: 510,
    studentInnovatorsCount: 2900,
    activeProjectsCount: 9,
    verified: true,
    contactEmail: 'collaborate@pilani.bits-pilani.ac.in'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'DEPT-001',
    name: 'Department of Drinking Water & Sanitation',
    ministry: 'Ministry of Jal Shakti',
    state: 'Jharkhand',
    activeChallengesCount: 19,
    resolvedCount: 34,
    officersCount: 24,
    avgTurnaroundDays: 4.2
  },
  {
    id: 'DEPT-002',
    name: 'Department of Agriculture & Farmers Welfare',
    ministry: 'Ministry of Agriculture',
    state: 'Jharkhand',
    activeChallengesCount: 27,
    resolvedCount: 41,
    officersCount: 32,
    avgTurnaroundDays: 5.1
  },
  {
    id: 'DEPT-003',
    name: 'Ministry of Health and Family Welfare',
    ministry: 'Health & Family Welfare',
    state: 'Jharkhand',
    activeChallengesCount: 15,
    resolvedCount: 29,
    officersCount: 18,
    avgTurnaroundDays: 3.8
  },
  {
    id: 'DEPT-004',
    name: 'Ministry of Housing and Urban Affairs (Smart Cities)',
    ministry: 'MoHUA',
    state: 'Jharkhand',
    activeChallengesCount: 22,
    resolvedCount: 38,
    officersCount: 26,
    avgTurnaroundDays: 4.9
  }
];

export const INITIAL_INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'IND-001',
    name: 'Tata Community Initiatives Trust (CSR)',
    type: 'CSR Foundation',
    sector: 'Water, Sanitation & Rural Livelihoods',
    headquarters: 'Jamshedpur, Jharkhand',
    csrFocusAreas: ['Affordable Fluoride Filtration', 'Rural Gravity Water Grids', 'Women SHG Empowerment'],
    totalGrantsPledged: 4500000,
    activeCollaborationsCount: 6,
    verified: true
  },
  {
    id: 'IND-002',
    name: 'Infosys Science & Social Foundation',
    type: 'Enterprise',
    sector: 'Digital Inclusion & Smart Health',
    headquarters: 'Ranchi, Jharkhand',
    csrFocusAreas: ['Low-Bandwidth Telemedicine', 'Digital Public Goods', 'AI for Agriculture'],
    totalGrantsPledged: 7200000,
    activeCollaborationsCount: 9,
    verified: true
  },
  {
    id: 'IND-003',
    name: 'Mahindra CleanTech Innovations',
    type: 'Enterprise',
    sector: 'Renewable Energy & Farm Mechanization',
    headquarters: 'Bokaro, Jharkhand',
    csrFocusAreas: ['Agri-Waste Torrefaction', 'Solar Cold Storage for Smallholders'],
    totalGrantsPledged: 3800000,
    activeCollaborationsCount: 4,
    verified: true
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'CHAL-2026-001',
    title: 'High Fluoride Contamination and Irregular Piped Supply in Kanke Village',
    description: 'Groundwater in Kanke village has tested positive for fluoride levels exceeding 3.8 mg/L (safe limit is 1.0 mg/L). Over 320 children and senior citizens exhibit symptoms of dental and skeletal fluorosis. The existing overhead tank provides water only once every 4 days for 45 minutes, forcing residents to consume untreated tube-well water.',
    whoIsAffected: 'Approximately 2,400 rural residents, school children at Kanke Primary School, and elderly villagers.',
    durationExisted: 'More than 3 years; worsened severely over the past 8 months.',
    category: 'Water and Sanitation',
    subcategory: 'Fluoride Removal & Rural Water Distribution',
    tags: ['Fluorosis', 'Groundwater Quality', 'Rural Drinking Water', 'Filtration', 'Jal Jeevan'],
    sdgGoals: [6, 3, 10],
    priority: 'Critical',
    status: 'In Progress',
    classification: 'INNOVATION',
    sdg_target: 6,
    extracted_skills: ['Chemical Engineering', 'Water Filtration', 'Spectroscopy'],
    location: {
      state: 'Jharkhand',
      district: 'Ranchi',
      talukaBlock: 'Kanke',
      villageWard: 'Kanke Gram Panchayat',
      locality: 'Near Panchayat Bhavan & Primary School',
      pincode: '834006',
      address: 'Plot 14, Main Road, Kanke Village, Kanke Block, Ranchi, Jharkhand',
      lat: 23.4346,
      lng: 85.3206
    },
    evidence: [
      {
        id: 'EVD-001',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        name: 'Water_Discoloration_Sample.jpg',
        caption: 'Yellowish turbidity and lab tube showing precipitating salts',
        uploadedAt: '2026-01-18'
      },
      {
        id: 'EVD-002',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?auto=format&fit=crop&w=800&q=80',
        name: 'District_Lab_Report_Fluoride_3.8mg.pdf',
        caption: 'Official district water laboratory test certificate',
        uploadedAt: '2026-01-18'
      }
    ],
    impact: {
      affectedPeopleCount: 2400,
      affectedCommunity: 'Kanke and neighboring hamlets (Harijan Basti, Nai Basti)',
      severity: 'Severe',
      urgency: 'Immediate',
      frequency: 'Continuous',
      potentialBeneficiaries: '3,800 villagers across 2 adjacent wards',
      existingAttempts: 'Handpumps marked with red paint were installed, but locals have no alternative source.',
      suggestedSolution: 'Decentralized activated alumina or solar-powered electrodialysis filtration unit coupled with automated valve scheduling.'
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Phone',
      shareConsent: true,
      accuracyDeclaration: true
    },
    submittedBy: {
      id: 'USR-CIT-001',
      name: 'Ramesh Verma',
      phone: '+91 98765 43210',
      isAnonymous: false
    },
    submittedAt: '2026-01-18T10:30:00Z',
    updatedAt: '2026-02-14T15:45:00Z',
    timeline: [
      {
        status: 'Submitted',
        label: 'Citizen Challenge Lodged',
        timestamp: '2026-01-18T10:30:00Z',
        actor: 'Ramesh Verma (Citizen)',
        actorRole: 'citizen',
        notes: 'Submitted with lab test certificates and water sample photo.'
      },
      {
        status: 'Under Validation',
        label: 'Triage & Simulated AI Problem Analysis',
        timestamp: '2026-01-19T09:15:00Z',
        actor: 'AI Engine v2.4',
        actorRole: 'government',
        notes: 'Simulated AI suggested Category: Water and Sanitation (98% confidence). Priority: Critical. Matched to Jal Jeevan Mission.'
      },
      {
        status: 'Validated',
        label: 'Validated by Government Officer',
        timestamp: '2026-01-20T14:20:00Z',
        actor: 'Rajesh Kumar, IAS',
        actorRole: 'government',
        notes: 'Ground validation verified with Block Development Officer. Categorized as High Priority Jal Jeevan issue.'
      },
      {
        status: 'Assigned to University',
        label: 'Matched & Routed to BIT Mesra',
        timestamp: '2026-01-22T11:00:00Z',
        actor: 'Rajesh Kumar, IAS',
        actorRole: 'government',
        notes: 'Routed to BIT Mesra Advanced Water Testing Lab based on research expertise in low-cost fluoride remediation.'
      },
      {
        status: 'Project Initiated',
        label: 'University Accepted & Assembled Team',
        timestamp: '2026-01-25T16:00:00Z',
        actor: 'Prof. Sunita Rao (BIT Mesra)',
        actorRole: 'university',
        notes: 'Interdisciplinary team "AquaShuddhi" formed with Chemical Engg, IoT Sensors, and Social Policy students.'
      },
      {
        status: 'In Progress',
        label: 'Prototype & Field Testing Active',
        timestamp: '2026-02-10T12:00:00Z',
        actor: 'Team AquaShuddhi',
        actorRole: 'university',
        notes: 'Benchtop bio-sorbent filter developed. IoT automated dispensing kiosks undergoing pilot deployment in Kanke.'
      }
    ],
    aiAnalysis: {
      suggestedCategory: 'Water and Sanitation',
      categoryConfidence: 98,
      suggestedPriority: 'Critical',
      priorityRationale: 'Laboratory-verified toxic fluoride (3.8 mg/L) with reported skeletal morbidity among primary school students meets national emergency drinking water thresholds.',
      sdgAlignments: ['SDG 6: Clean Water & Sanitation', 'SDG 3: Good Health & Well-being', 'SDG 10: Reduced Inequalities'],
      duplicateSimilarityScore: 11,
      missingInformationFlags: [],
      recommendedUniversities: [
        {
          institutionId: 'INST-001',
          institutionName: 'BIT Mesra',
          matchScore: 96,
          matchReason: 'Pioneered low-cost activated alumina and bone-char free bio-composite sorbents for fluoride in Gangetic plains.',
          facilities: ['Advanced Water Quality Testing Lab', 'Biochemical Engineering Center']
        },
        {
          institutionId: 'INST-002',
          institutionName: 'NIT Jamshedpur',
          matchScore: 82,
          matchReason: 'Expertise in solar electro-dialysis and remote rural desalination.',
          facilities: ['Microgrid Testing Bed']
        }
      ],
      suggestedDepartment: 'Department of Drinking Water & Sanitation',
      status: 'Accepted'
    },
    assignedDepartment: 'Department of Drinking Water & Sanitation',
    assignedUniversity: {
      institutionId: 'INST-001',
      institutionName: 'BIT Mesra',
      assignedDate: '2026-01-22',
      status: 'Accepted',
      leadFaculty: 'Prof. Sunita Rao'
    },
    linkedProjectId: 'PROJ-2026-001',
    upvotes: 412,
    upvotedByUserIds: ['USR-CIT-001', 'USR-CIT-002', 'USR-UNI-001'],
    followersCount: 184,
    comments: [
      {
        id: 'COM-001',
        userId: 'USR-CIT-002',
        userName: 'Mahesh Sarpanch',
        userRole: 'citizen',
        text: 'As Gram Pradhan, we welcome the IIT team. The community hall near primary school has 24/7 solar power and space ready for test filter installation.',
        createdAt: '2026-01-24T14:10:00Z'
      },
      {
        id: 'COM-002',
        userId: 'USR-UNI-001',
        userName: 'Prof. Sunita Rao (BIT Mesra)',
        userRole: 'university',
        text: 'We have dispatched 2 student researchers with water telemetry test kits. First water samples collected yesterday show 3.65 mg/L Fluoride. Solution bench testing initiated.',
        createdAt: '2026-01-28T09:40:00Z',
        isOfficial: true
      },
      {
        id: 'COM-003',
        userId: 'USR-IND-001',
        userName: 'Ananya Sen (Tata Trusts)',
        userRole: 'industry',
        text: 'Tata Trusts has agreed to match equipment funding up to Rs. 5.5 Lakhs for the pilot filtration kiosks once bench testing passes government BIS 10500 standards.',
        createdAt: '2026-02-05T11:20:00Z',
        isOfficial: true
      }
    ],
    internalGovNotes: [
      'Verified with Ranchi district administration. Funds can be linked under Jal Jeevan Mission Special Innovation Sub-Head 4B.'
    ]
  },
  {
    id: 'CHAL-2026-002',
    title: 'Crop Residue Burning Smoke Hazard and Soil Nutrient Degradation',
    description: 'Post-paddy harvest burning of 14,000 hectares of paddy stubble in Bokaro and Dhanbad districts creates toxic PM2.5 spikes (>550 ug/m3) affecting respiratory health of 1.2 million citizens across Jharkhand while stripping topsoil of nitrogen and microbial biodiversity.',
    whoIsAffected: 'Over 85,000 farmers and 1.2M urban/rural residents across Jharkhand.',
    durationExisted: 'Seasonal recurring issue for past 15 years; severe each October-November.',
    category: 'Agriculture',
    subcategory: 'Stubble Management & Bio-Energy',
    tags: ['Stubble Burning', 'Air Quality', 'AgriTech', 'BioPellets', 'Soil Health'],
    sdgGoals: [13, 2, 7, 3],
    priority: 'High',
    status: 'Assigned to University',
    classification: 'INNOVATION',
    sdg_target: 2,
    extracted_skills: ['Soil Mechanics', 'Agriculture', 'Drones'],
    location: {
      state: 'Jharkhand',
      district: 'Bokaro',
      talukaBlock: 'Chas',
      villageWard: 'Chas Rural Panchayat',
      locality: 'Farm Clusters Along NH-5',
      pincode: '827013',
      address: 'Chas Agricultural Belt, Bokaro, Jharkhand',
      lat: 23.6353,
      lng: 86.1511
    },
    evidence: [
      {
        id: 'EVD-003',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        name: 'Stubble_Field_Smoke.jpg',
        caption: 'Satellite and ground photography showing localized stubble burn plumes',
        uploadedAt: '2026-01-10'
      }
    ],
    impact: {
      affectedPeopleCount: 1200000,
      affectedCommunity: 'Farming communities and downwind regional population',
      severity: 'Severe',
      urgency: 'High',
      frequency: 'Seasonal',
      potentialBeneficiaries: '350,000 smallholder farmers',
      existingAttempts: 'Baler subsidies exist, but logistics and transport costs make burning cheaper for smallholders.',
      suggestedSolution: 'Mobile on-farm microbial torrefaction or rapid densification into industrial boiler bio-pellets with guaranteed local off-take.'
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Portal Only',
      shareConsent: true,
      accuracyDeclaration: true
    },
    submittedBy: {
      id: 'USR-CIT-003',
      name: 'Gurpreet Singh',
      phone: '+91 97812 34567',
      isAnonymous: false
    },
    submittedAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-02T16:15:00Z',
    timeline: [
      {
        status: 'Submitted',
        label: 'Citizen Challenge Lodged',
        timestamp: '2026-01-10T08:00:00Z',
        actor: 'Gurpreet Singh (Farmer)',
        actorRole: 'citizen'
      },
      {
        status: 'Validated',
        label: 'Validated by Dept of Agriculture',
        timestamp: '2026-01-14T11:00:00Z',
        actor: 'Ministry of Agriculture',
        actorRole: 'government'
      },
      {
        status: 'Assigned to University',
        label: 'Assigned to Birsa Agricultural University',
        timestamp: '2026-01-20T10:00:00Z',
        actor: 'Rajesh Kumar, IAS',
        actorRole: 'government'
      }
    ],
    aiAnalysis: {
      suggestedCategory: 'Agriculture',
      categoryConfidence: 96,
      suggestedPriority: 'High',
      priorityRationale: 'High environmental damage and seasonal respiratory hospitalizations across interstate corridors.',
      sdgAlignments: ['SDG 13: Climate Action', 'SDG 2: Zero Hunger', 'SDG 7: Affordable & Clean Energy'],
      duplicateSimilarityScore: 8,
      missingInformationFlags: [],
      recommendedUniversities: [
        {
          institutionId: 'INST-003',
          institutionName: 'Birsa Agricultural University (BAU)',
          matchScore: 98,
          matchReason: 'Direct agricultural network in Ranchi and operational bio-pellet research facilities.',
          facilities: ['Bio-Pelletization & Pyrolysis Plant']
        }
      ],
      suggestedDepartment: 'Department of Agriculture & Farmers Welfare',
      status: 'Accepted'
    },
    assignedDepartment: 'Department of Agriculture & Farmers Welfare',
    assignedUniversity: {
      institutionId: 'INST-003',
      institutionName: 'Birsa Agricultural University (BAU)',
      assignedDate: '2026-01-20',
      status: 'Accepted',
      leadFaculty: 'Dr. Harbhajan Gill'
    },
    upvotes: 685,
    upvotedByUserIds: ['USR-CIT-001'],
    followersCount: 320,
    comments: []
  },
  {
    id: 'CHAL-2026-003',
    title: 'Lack of Cold-Chain Storage for Tribal Honey and Medicinal Herbs in Gumla',
    description: 'Indigenous tribal farmers lose up to 45% of harvested wild stingless bee honey and raw medicinal forest herbs to humidity, fermentation, and mold during monsoon months due to absence of off-grid solar cold storage units at collection points.',
    whoIsAffected: '680 tribal households in Palkot and Gumla forest fringe villages.',
    durationExisted: 'Ongoing for generations; acute economic distress during heavy monsoons.',
    category: 'Livelihoods',
    subcategory: 'Post-Harvest Cold Storage & Off-Grid Solar',
    tags: ['Tribal Livelihoods', 'Solar Cold Storage', 'Forest Produce', 'Gumla', 'Value Addition'],
    sdgGoals: [1, 8, 7, 12],
    priority: 'Medium',
    status: 'Validated',
    classification: 'GRIEVANCE',
    sdg_target: 8,
    extracted_skills: ['IoT', 'Sensors'],
    location: {
      state: 'Jharkhand',
      district: 'Gumla',
      talukaBlock: 'Gumla',
      villageWard: 'Palkot Tribal Settlement',
      locality: 'Forest Fringe Collection Center',
      pincode: '835207',
      address: 'Tribal Co-op Society Depot, Palkot, Gumla, Jharkhand',
      lat: 23.0437,
      lng: 84.8792
    },
    evidence: [
      {
        id: 'EVD-004',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        name: 'Honey_Spoilage_Inspection.jpg',
        caption: 'Fermenting raw comb honey jars stored without temperature control',
        uploadedAt: '2026-01-28'
      }
    ],
    impact: {
      affectedPeopleCount: 3200,
      affectedCommunity: 'Paniya and Kurichiya tribal honey gatherers',
      severity: 'Moderate',
      urgency: 'Medium',
      frequency: 'Continuous',
      potentialBeneficiaries: '1,200 tribal families across Gumla district',
      existingAttempts: 'Manual drying sheds cannot handle 90%+ relative humidity in Western Ghats monsoons.',
      suggestedSolution: 'Micro-scale phase change material (PCM) based solar cold locker units maintaining 12-15°C with zero grid dependency.'
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Phone',
      shareConsent: true,
      accuracyDeclaration: true
    },
    submittedBy: {
      id: 'USR-CIT-004',
      name: 'K. Chandran',
      phone: '+91 94471 23456',
      isAnonymous: false
    },
    submittedAt: '2026-01-28T14:30:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
    timeline: [
      {
        status: 'Submitted',
        label: 'Citizen Challenge Lodged',
        timestamp: '2026-01-28T14:30:00Z',
        actor: 'K. Chandran (Tribal Co-op Secretary)',
        actorRole: 'citizen'
      },
      {
        status: 'Validated',
        label: 'Validated by District Officer',
        timestamp: '2026-02-01T10:00:00Z',
        actor: 'Rajesh Kumar, IAS',
        actorRole: 'government'
      }
    ],
    aiAnalysis: {
      suggestedCategory: 'Livelihoods',
      categoryConfidence: 91,
      suggestedPriority: 'Medium',
      priorityRationale: 'High economic impact for vulnerable indigenous communities, clear technological feasibility with solar thermal/PCM storage.',
      sdgAlignments: ['SDG 1: No Poverty', 'SDG 8: Decent Work & Economic Growth', 'SDG 7: Affordable Clean Energy'],
      duplicateSimilarityScore: 5,
      missingInformationFlags: [],
      recommendedUniversities: [
        {
          institutionId: 'INST-002',
          institutionName: 'NIT Jamshedpur',
          matchScore: 92,
          matchReason: 'Pioneered PCM thermal cold lockers for agricultural produce.',
          facilities: ['Renewable Microgrid Testing Bed', 'Rural Tech Center']
        }
      ],
      suggestedDepartment: 'Ministry of Housing and Urban Affairs (Smart Cities)',
      status: 'Accepted'
    },
    upvotes: 215,
    upvotedByUserIds: [],
    followersCount: 88,
    comments: []
  },
  {
    id: 'CHAL-2026-004',
    title: 'Urban Flash Flood Waterlogging and Sewer Backflow in Dhanbad Ward Clusters',
    description: 'During moderate rains (20mm/hr), severe drainage choke floods over 400 tenements in Sector 18 with hazardous sewage mix. Water stays stagnant for 48-72 hours causing dengue, leptospirosis, and school closures.',
    whoIsAffected: '1,800 low-income residents, daily wage workers, and school children.',
    durationExisted: 'Past 4 monsoon seasons; worsened after road re-carpeting altered natural slope.',
    category: 'Urban Infrastructure',
    subcategory: 'Stormwater Management & Silt Prevention',
    tags: ['Urban Flooding', 'Drainage', 'Sanitation', 'Public Health', 'Slum Infrastructure'],
    sdgGoals: [11, 6, 3],
    priority: 'High',
    status: 'Submitted',
    location: {
      state: 'Jharkhand',
      district: 'Dhanbad',
      talukaBlock: 'Govindpur',
      villageWard: 'Ward 42, Hadapsar',
      locality: 'Sector 18 Low-Lying Tenements',
      pincode: '828109',
      address: 'Near Old Canal Road, Govindpur, Dhanbad, Jharkhand',
      lat: 23.7957,
      lng: 86.4304
    },
    evidence: [
      {
        id: 'EVD-005',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        name: 'Street_Flooding_Knee_Deep.jpg',
        caption: 'Knee-deep blackwater inundation after 35 minutes of rain',
        uploadedAt: '2026-02-12'
      }
    ],
    impact: {
      affectedPeopleCount: 1800,
      affectedCommunity: 'Slum dwellers and informal sector workers',
      severity: 'Severe',
      urgency: 'High',
      frequency: 'Seasonal',
      potentialBeneficiaries: '3,500 residents in surrounding low catchment zone',
      existingAttempts: 'Municipal pumps deployed manually, but arrive 24 hours too late after homes are already submerged.',
      suggestedSolution: 'Decentralized smart stormwater bypass trenching with low-cost ultrasonic water level sensors and automated micro-sluice gates.'
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Phone',
      shareConsent: true,
      accuracyDeclaration: true
    },
    submittedBy: {
      id: 'USR-CIT-005',
      name: 'Sunil Jadhav',
      phone: '+91 98220 12345',
      isAnonymous: false
    },
    submittedAt: '2026-02-12T17:00:00Z',
    updatedAt: '2026-02-12T17:00:00Z',
    timeline: [
      {
        status: 'Submitted',
        label: 'Citizen Challenge Lodged',
        timestamp: '2026-02-12T17:00:00Z',
        actor: 'Sunil Jadhav (Resident)',
        actorRole: 'citizen',
        notes: 'Awaiting government validation queue review.'
      }
    ],
    aiAnalysis: {
      suggestedCategory: 'Urban Infrastructure',
      categoryConfidence: 94,
      suggestedPriority: 'High',
      priorityRationale: 'High public health risk from disease vectors (dengue, cholera) combined with infrastructure paralysis in high-density urban cluster.',
      sdgAlignments: ['SDG 11: Sustainable Cities & Communities', 'SDG 6: Clean Water & Sanitation'],
      duplicateSimilarityScore: 14,
      missingInformationFlags: ['Need topographical gradient map or municipal sewer line schematics'],
      recommendedUniversities: [
        {
          institutionId: 'INST-001',
          institutionName: 'BIT Mesra',
          matchScore: 89,
          matchReason: 'Hydraulic modelling and urban runoff management researchers.',
          facilities: ['Advanced Water Testing & Spectrophotometry Lab']
        }
      ],
      suggestedDepartment: 'Ministry of Housing and Urban Affairs (Smart Cities)',
      status: 'Pending Review'
    },
    upvotes: 142,
    upvotedByUserIds: [],
    followersCount: 65,
    comments: []
  },
  {
    id: 'CHAL-2026-005',
    title: 'Lack of Real-Time Indian Sign Language (ISL) Translation at District Hospital OPD Counters',
    description: 'Deaf and hard-of-hearing patients visiting district civil hospitals struggle to communicate their symptoms, medical history, or emergency pain to triage nurses and pharmacy counters. Translators are almost never present on-site.',
    whoIsAffected: 'Over 14,000 deaf citizens visiting district health facilities annually in Deoghar.',
    durationExisted: 'Chronic systemic barrier.',
    category: 'Accessibility',
    subcategory: 'Assistive Tech & Public Service Inclusivity',
    tags: ['Sign Language', 'Accessibility', 'Healthcare Inclusion', 'AI Computer Vision', 'Divyangjan'],
    sdgGoals: [10, 3, 9],
    priority: 'Medium',
    status: 'Validated',
    location: {
      state: 'Jharkhand',
      district: 'Deoghar',
      talukaBlock: 'Deoghar Sadar',
      villageWard: 'Ward 12',
      locality: 'SMS Medical College & District Hospital OPD',
      pincode: '814112',
      address: 'Court Road, Deoghar, Jharkhand',
      lat: 24.4852,
      lng: 86.6948
    },
    evidence: [],
    impact: {
      affectedPeopleCount: 14000,
      affectedCommunity: 'Deaf and speech-impaired citizens, their caregivers, and triage doctors',
      severity: 'Moderate',
      urgency: 'Medium',
      frequency: 'Continuous',
      potentialBeneficiaries: 'Over 100,000 Divyangjan patients across Jharkhand hospitals',
      existingAttempts: 'Paper and pen notes, which fail when patients are non-literate or in acute physical distress.',
      suggestedSolution: 'On-device camera kiosk running lightweight edge AI computer vision trained on Indian Sign Language (ISL) vocabulary producing two-way speech-to-ISL avatars.'
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Email',
      shareConsent: true,
      accuracyDeclaration: true
    },
    submittedBy: {
      id: 'USR-CIT-006',
      name: 'Pooja Sharma (Divyang Aid Worker)',
      phone: '+91 94140 98765',
      isAnonymous: false
    },
    submittedAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-30T15:20:00Z',
    timeline: [
      {
        status: 'Submitted',
        label: 'Citizen Challenge Lodged',
        timestamp: '2026-01-22T09:00:00Z',
        actor: 'Pooja Sharma',
        actorRole: 'citizen'
      },
      {
        status: 'Validated',
        label: 'Validated by Health Dept',
        timestamp: '2026-01-30T15:20:00Z',
        actor: 'Ministry of Health and Family Welfare',
        actorRole: 'government'
      }
    ],
    aiAnalysis: {
      suggestedCategory: 'Accessibility',
      categoryConfidence: 97,
      suggestedPriority: 'Medium',
      priorityRationale: 'High human dignity and healthcare equity impact; ideal for university AI/ML and HCI student projects.',
      sdgAlignments: ['SDG 10: Reduced Inequalities', 'SDG 3: Good Health & Well-being'],
      duplicateSimilarityScore: 3,
      missingInformationFlags: [],
      recommendedUniversities: [
        {
          institutionId: 'INST-004',
          institutionName: 'Amity University Jharkhand',
          matchScore: 94,
          matchReason: 'Computer vision lab currently working on Indian language multi-modal interfaces.',
          facilities: ['Telemedicine IoT Testing Lab']
        }
      ],
      suggestedDepartment: 'Ministry of Health and Family Welfare',
      status: 'Accepted'
    },
    upvotes: 388,
    upvotedByUserIds: [],
    followersCount: 142,
    comments: []
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PROJ-2026-001',
    title: 'AquaShuddhi: Solar-Assisted Low-Cost Fluoride Remediation & Smart Kiosk',
    challengeId: 'CHAL-2026-001',
    challengeTitle: 'High Fluoride Contamination and Irregular Piped Supply in Kanke Village',
    category: 'Water and Sanitation',
    universityId: 'INST-001',
    universityName: 'BIT Mesra',
    teamName: 'Team AquaShuddhi (Interdisciplinary)',
    facultyMentor: {
      id: 'FM-001',
      name: 'Prof. Sunita Rao',
      department: 'Environmental Engineering',
      designation: 'Professor & Dean R&D',
      email: 's.rao@iitd.ac.in',
      specialization: 'Groundwater Geochemistry & Nanocomposite Adsorption'
    },
    studentTeam: [
      {
        id: 'STU-001',
        name: 'Aarav Sharma',
        discipline: 'Chemical Engineering (M.Tech)',
        role: 'Team Lead & Sorbent Formulation',
        email: 'aarav.chem@iitd.ac.in'
      },
      {
        id: 'STU-002',
        name: 'Meera Iyer',
        discipline: 'Computer Science (B.Tech)',
        role: 'IoT Firmware & Dispensing Telemetry',
        email: 'meera.cs@iitd.ac.in'
      },
      {
        id: 'STU-003',
        name: 'Rohan Deshmukh',
        discipline: 'Mechanical Engineering (B.Tech)',
        role: 'Kiosk Enclosure & Hydraulic Piping',
        email: 'rohan.mech@iitd.ac.in'
      },
      {
        id: 'STU-004',
        name: 'Priyanka Sen',
        discipline: 'Public Policy (M.Sc)',
        role: 'Community Engagement & Water Tariff Model',
        email: 'priyanka.hss@iitd.ac.in'
      }
    ],
    stage: 'Pilot',
    progressPercentage: 78,
    proposal: {
      problemStatement: 'Groundwater in Kanke village has lethal 3.8 mg/L Fluoride causing fluorosis in 320 children.',
      proposedSolution: 'A dual-stage column filter using modified bio-char combined with low-cost activated alumina bed, powered by 300W solar panel with IoT flow metering to ensure safe water <0.8 mg/L.',
      technicalMethodology: 'Continuous fixed-bed adsorption column with regenerative brine backwash. In-line spectrophotometric sensor connected via 4G micro-gateway to state Jal Jeevan telemetry portal.',
      requiredBudget: 480000,
      durationMonths: 6,
      riskAssessment: 'Sorbent exhaustion during peak summer demand. Mitigated by automated pressure-drop alert.',
      societalImpactProjected: 'Provide 2,400 villagers daily access to 20L/person of WHO/BIS certified safe drinking water.',
      sustainabilityPlan: 'Community water ATM card recharge managed by local Women SHG (Prerna Mahila Samiti) at 15 paise/liter to cover maintenance and sorbent replenishment.',
      submittedAt: '2026-01-26',
      status: 'Approved',
      reviewerFeedback: 'Excellent multidisciplinary synergy and sustainable community operation model. Seed grant of Rs. 4,80,000 sanctioned.'
    },
    budget: {
      requested: 480000,
      approved: 480000,
      spent: 345000,
      csrPledged: 550000
    },
    industryPartners: [
      {
        partnerId: 'IND-001',
        partnerName: 'Tata Community Initiatives Trust (CSR)',
        partnershipType: 'CSR Funding',
        pledgeDescription: 'Rs. 5,50,000 grant for manufacturing 3 community kiosk units and sponsoring 1 year sorbent media supply.',
        status: 'Active'
      },
      {
        partnerId: 'IND-003',
        partnerName: 'Mahindra CleanTech Innovations',
        partnershipType: 'Equipment Access',
        pledgeDescription: 'Donated 2x 400W bifacial solar PV panels and MPPT charge controllers for off-grid operation.',
        status: 'Active'
      }
    ],
    tasks: [
      {
        id: 'TSK-001',
        title: 'Conduct ICP-MS water spectrometry on Kanke baseline samples',
        assignedTo: 'Aarav Sharma',
        priority: 'High',
        status: 'Done',
        dueDate: '2026-01-30'
      },
      {
        id: 'TSK-002',
        title: 'Assemble 500 LPH fixed-bed adsorption column prototype',
        assignedTo: 'Rohan Deshmukh',
        priority: 'High',
        status: 'Done',
        dueDate: '2026-02-08'
      },
      {
        id: 'TSK-003',
        title: 'Calibrate ESP32 IoT TDS & Fluoride turbidity telemetry sensor',
        assignedTo: 'Meera Iyer',
        priority: 'Medium',
        status: 'Done',
        dueDate: '2026-02-12'
      },
      {
        id: 'TSK-004',
        title: 'Train Prerna Mahila Samiti SHG members on filter backwash procedure',
        assignedTo: 'Priyanka Sen',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-02-25'
      },
      {
        id: 'TSK-005',
        title: 'Collect 30-day continuous village usage data & health survey',
        assignedTo: 'Priyanka Sen',
        priority: 'Medium',
        status: 'Todo',
        dueDate: '2026-03-15'
      }
    ],
    milestones: [
      {
        id: 'MS-001',
        title: 'Milestone 1: Baseline Characterization & Lab Scale Sorbent Validation',
        description: 'Establish fluoride adsorption isotherms under varying pH and hardness conditions.',
        stage: 'Prototype',
        dueDate: '2026-02-05',
        completedDate: '2026-02-04',
        status: 'Approved',
        deliverables: ['Lab Test Report BIS 10500 Compliant', 'Prototype CAD Drawing'],
        feedback: 'Results exceed requirements: Fluoride reduced from 3.8 mg/L to 0.45 mg/L without lowering vital minerals.',
        approvedBy: 'Rajesh Kumar, IAS'
      },
      {
        id: 'MS-002',
        title: 'Milestone 2: Field Scale Kiosk Prototyping & IoT Telemetry',
        description: 'Fabricate solar-powered stainless steel kiosk with automatic valve shutoff.',
        stage: 'Testing',
        dueDate: '2026-02-15',
        completedDate: '2026-02-14',
        status: 'Approved',
        deliverables: ['Telemetry Dashboard Live URL', 'Electrical & Structural Safety Certificate'],
        feedback: 'IoT gateway successfully sending packets to cloud Jal Jeevan server.',
        approvedBy: 'Prof. Sunita Rao'
      },
      {
        id: 'MS-003',
        title: 'Milestone 3: Kanke Village Pilot Deployment & 60-Day Field Validation',
        description: 'Deploy kiosk next to Kanke Primary School, serving 1,500 villagers daily.',
        stage: 'Pilot',
        dueDate: '2026-03-30',
        status: 'In Progress',
        deliverables: ['SHG Operation Agreement', 'Field Water Quality Audit'],
        feedback: 'Pilot currently operational; 4,200 liters dispensed in first 5 days.'
      },
      {
        id: 'MS-004',
        title: 'Milestone 4: Technology Transfer & Scalability Blueprint',
        description: 'Open-access blueprint package and transfer license to district jal nigams.',
        stage: 'Technology Transfer',
        dueDate: '2026-04-30',
        status: 'Pending',
        deliverables: ['Technology Transfer Document', 'Final Public Impact Report']
      }
    ],
    deliverables: [
      {
        id: 'DEL-001',
        title: 'IITD_WaterQuality_Fluoride_Removal_Lab_Report.pdf',
        milestoneId: 'MS-001',
        submittedBy: 'Aarav Sharma',
        submittedAt: '2026-02-04',
        summary: 'Certified lab report showing 88.2% fluoride elimination capacity across 10,000 bed volumes.',
        status: 'Approved'
      },
      {
        id: 'DEL-002',
        title: 'Kanke_Site_Installation_Photos_&_Readings.pdf',
        milestoneId: 'MS-002',
        submittedBy: 'Rohan Deshmukh',
        submittedAt: '2026-02-14',
        summary: 'Field installation verification signed by Village Pradhan and Assistant Engineer Jal Nigam.',
        status: 'Approved'
      }
    ],
    testRecords: [
      {
        id: 'TR-001',
        testName: 'Fluoride Concentration Post-Filtration Test',
        date: '2026-02-03',
        parameters: 'Feed water Fluoride: 3.82 mg/L, Flow Rate: 8.5 L/min, Temp: 22°C',
        result: 'Passed',
        metrics: 'Treated effluent: 0.42 mg/L Fluoride (Safe BIS limit < 1.0 mg/L)',
        notes: 'Passed all BIS 10500 drinking water parameters including coliform absence.'
      },
      {
        id: 'TR-002',
        testName: 'Solar PV Off-Grid Stress Test',
        date: '2026-02-11',
        parameters: 'Cloudy condition simulation (200 W/m2 irradiance for 4 hours continuous run)',
        result: 'Passed',
        metrics: 'Battery remained at 68% state-of-charge; zero flow interruptions',
        notes: 'LiFePO4 battery pack handles 2.5 days of complete autonomy.'
      }
    ],
    pilotRecord: {
      id: 'PILOT-001',
      location: 'Primary School Compound, Kanke Village, Kanke Block, Ranchi, Jharkhand',
      beneficiariesCount: 1650,
      startDate: '2026-02-10',
      status: 'Active',
      feedbackSummary: 'High satisfaction reported by villagers; stomach ailments and tooth staining complaints among children dropping steadily.',
      verifiedOutcomes: [
        '16,800 Liters of BIS-compliant potable water dispensed in first 10 days of trial',
        'Zero electrical grid dependence (100% solar powered)',
        'Local Women Self-Help Group (SHG) trained and generating Rs. 2,520 in micro-tariff maintenance funds'
      ]
    },
    outcomes: [
      {
        id: 'OUT-001',
        type: 'Patent Filed',
        title: 'Regenerable Bio-Composite Adsorbent Matrix for Rapid Defluoridation of Gangetic Aquifers',
        referenceNo: 'IN-PAT-2026-110482',
        date: '2026-02-16',
        verified: true,
        description: 'Patent application jointly filed by BIT Mesra Industrial Research and Development Unit.'
      },
      {
        id: 'OUT-002',
        type: 'Publication',
        title: 'Low-Cost Decentralized Water Treatment in Rural Ranchi: A Multidisciplinary Implementation Study',
        referenceNo: 'DOI: 10.1016/j.watres.2026.02.091',
        date: '2026-02-18',
        verified: true,
        description: 'Accepted in Journal of Water Research and Rural Infrastructure.'
      }
    ],
    createdAt: '2026-01-25',
    updatedAt: '2026-02-20'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOTIF-001',
    recipientRole: 'citizen',
    recipientId: 'USR-CIT-001',
    title: 'Pilot Deployment Milestone Achieved! 🎉',
    message: 'Your submitted challenge for Kanke Village has reached the Pilot stage! Solar water kiosk is operational near the primary school.',
    link: '/citizen/challenges/CHAL-2026-001',
    type: 'success',
    read: false,
    createdAt: '2026-02-15T09:30:00Z'
  },
  {
    id: 'NOTIF-002',
    recipientRole: 'university',
    recipientId: 'USR-UNI-001',
    title: 'CSR Matching Grant Confirmed',
    message: 'Tata Community Initiatives Trust pledged Rs. 5.5 Lakhs for your AquaShuddhi prototype pilot scale-up.',
    link: '/university/projects',
    type: 'success',
    read: true,
    createdAt: '2026-02-06T14:15:00Z'
  },
  {
    id: 'NOTIF-003',
    recipientRole: 'government',
    recipientId: 'USR-GOV-001',
    title: 'New High Priority Challenge Submitted',
    message: 'Urban flash flood waterlogging reported in Dhanbad Ward with 1,800 affected citizens. Requires validation review.',
    link: '/government/validation',
    type: 'alert',
    read: false,
    createdAt: '2026-02-12T17:15:00Z'
  },
  {
    id: 'NOTIF-004',
    recipientRole: 'industry',
    recipientId: 'USR-IND-001',
    title: 'Milestone Approval Notification',
    message: 'BIT Mesra has completed Field Kiosk Telemetry validation for the Kanke Project.',
    link: '/projects/PROJ-2026-001',
    type: 'info',
    read: false,
    createdAt: '2026-02-14T16:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-01-18 10:30:00',
    actor: 'Ramesh Verma (Citizen)',
    actorRole: 'citizen',
    action: 'SUBMIT_CHALLENGE',
    targetId: 'CHAL-2026-001',
    details: 'Submitted high fluoride water contamination challenge with 2 files.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-01-20 14:20:00',
    actor: 'Rajesh Kumar, IAS',
    actorRole: 'government',
    action: 'VALIDATE_CHALLENGE',
    targetId: 'CHAL-2026-001',
    details: 'Status changed from Under Validation to Validated. Priority set to Critical.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-01-22 11:00:00',
    actor: 'Rajesh Kumar, IAS',
    actorRole: 'government',
    action: 'ROUTE_TO_UNIVERSITY',
    targetId: 'CHAL-2026-001',
    details: 'Invitation sent to BIT Mesra (INST-001).'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-01-25 16:00:00',
    actor: 'Prof. Sunita Rao',
    actorRole: 'university',
    action: 'ACCEPT_CHALLENGE',
    targetId: 'CHAL-2026-001',
    details: 'BIT Mesra accepted assignment. Formed project PROJ-2026-001.'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-02-05 11:20:00',
    actor: 'Ananya Sen',
    actorRole: 'industry',
    action: 'PLEDGE_CSR_FUNDING',
    targetId: 'PROJ-2026-001',
    details: 'Tata Trusts pledged Rs 5,50,000 for kiosk pilot fabrication.'
  }
];
