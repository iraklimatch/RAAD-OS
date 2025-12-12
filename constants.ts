
import { Project, User, Request, Report, PlaybookPhase, AuditLog } from './types';

// --- Playbook Definition (Mainly for generic P5-P6 now) ---
export const PLAYBOOK: PlaybookPhase[] = [
  { id: 'P1', title: 'P1 Project Definition', items: [] },
  { id: 'P2', title: 'P2 Data Prep', items: [] },
  { id: 'P3', title: 'P3 Data Analysis', items: [] },
  { id: 'P4', title: 'P4 Development', items: [] },
  {
    id: 'P5',
    title: 'P5 Implementation',
    items: [
      { id: 'p5_final', label: 'Final Build', description: 'Production ready build.', required: true },
      { id: 'p5_doc', label: 'Documentation', description: 'Technical and user documentation.', required: true },
    ]
  },
  {
    id: 'P6',
    title: 'P6 Closeout',
    items: [
      { id: 'p6_retro', label: 'Retrospective', description: 'Lessons learned.', required: false },
      { id: 'p6_archive', label: 'Archive Project', description: 'Move to completed folder.', required: true },
    ]
  }
];

// --- Mock Users ---
export const USERS: User[] = [
  { id: 'u1', name: 'Sarah Manager', email: 'sarah@dps.k12.org', role: 'RAAD_MANAGER', avatarUrl: 'https://picsum.photos/id/1011/200/200' },
  { id: 'u2', name: 'Alex Analyst', email: 'alex@dps.k12.org', role: 'RAAD_ANALYST', avatarUrl: 'https://picsum.photos/id/1012/201/201' },
  { id: 'u3', name: 'Jordan Customer', email: 'jordan@transportation.dps', role: 'DEPARTMENT_CUSTOMER', department: 'Transportation', avatarUrl: 'https://picsum.photos/id/1025/202/202' },
  { id: 'u4', name: 'Dr. Emily Research', email: 'emily@dps.k12.org', role: 'RAAD_ANALYST', avatarUrl: 'https://picsum.photos/id/1027/202/202' },
  { id: 'u5', name: 'Mike Facilities', email: 'mike@fac.dps', role: 'DEPARTMENT_CUSTOMER', department: 'Facilities', avatarUrl: 'https://picsum.photos/id/1005/202/202' },
];

const EMPTY_P1 = {
  background: '',
  goals: '',
  coreQuestion: '',
  successDefinition: '',
  relevantMetrics: '',
  targetAudience: '',
  inScope: '',
  outScope: '',
  stakeholders: [],
  startDate: '',
  endDate: '',
  otherDates: '',
  budgetNonRecurring: '',
  budgetRecurring: '',
  constraints: '',
  assumptions: '',
  risksDependencies: '',
  clientSignOff: { status: 'Pending' as const },
  lastUpdated: new Date().toISOString(),
  completionPercentage: 0
};

const EMPTY_P2 = {
  dataSourceId: '', accessNeeded: '', format: '', betterAlternatives: '',
  extractionReproducible: '', reportLevelFilters: '', manipulation: '', automationOpportunity: '',
  cleaningSteps: '', calcFieldsStrategy: '', missingValuesStrategy: '',
  validationSanityCheck: false, validationEdgeCase: false, validationCheckpoint: false,
  completionPercentage: 0
};

const EMPTY_P3 = {
  questionsToAnswer: '', keyDeliverable: '',
  codeReviewDone: false, logicReviewDone: false, adaptations: '',
  deliveryMethod: '' as const,
  completionPercentage: 0
};

const EMPTY_P4 = {
  mode: null as any,
  p4a: { updateFrequency: '', keyMetricJustification: '', deliveryMethod: '', accessibilityRequirements: '', communicationList: '' },
  p4b: { 
    functionalityDecision: 'Mockup' as const, prototypeType: '', dataFreshness: '',
    widgets: [], filters: [], engineeringAccess: '', engineeringDataModel: '', userFeedbackAction: '',
    dotsHandoff: { prototypeFile: false, dataSources: false, calcLogic: false, refreshCadence: false, ticketNumber: '' }
  }
};

// --- Mock Projects ---
export const PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: 'Bus Route Optimization 2025',
    type: 'Project',
    department: 'Transportation',
    analyticsLeadId: 'u2',
    supportingAnalystIds: ['u4'],
    description: 'Analyze current routes to reduce fuel consumption by 5%.',
    status: 'In Progress',
    priority: 'Weekly Priority',
    phase: 'P3',
    startDate: '2024-01-15',
    targetEndDate: '2024-04-30',
    lastUpdated: '2024-02-20',
    currentStep: 'Running spatial clustering models.',
    nextSteps: 'Present initial clusters to Transportation Director.',
    p1Definition: {
      ...EMPTY_P1,
      background: 'Fuel costs are rising.',
      goals: 'Reduce daily mileage by 5%.',
      stakeholders: [{ userId: 'u3', role: 'Client', status: 'Accepted' }],
      completionPercentage: 100,
      clientSignOff: { status: 'Approved', signedBy: 'u3' }
    },
    p2Definition: { ...EMPTY_P2, completionPercentage: 100 },
    p3Definition: { ...EMPTY_P3, deliveryMethod: 'Final Report (P4-A)', completionPercentage: 50 },
    p4Definition: { ...EMPTY_P4, mode: 'A' },
    playbookResponses: {},
    notes: 'Data from GPS logs is messy.',
    documents: [{ name: 'Project Brief', url: '#' }],
    progress: 65
  },
  {
    id: 'proj_2',
    name: 'School Lunch Waste Dashboard',
    type: 'Dashboard',
    department: 'Food Services',
    analyticsLeadId: 'u2',
    supportingAnalystIds: [],
    description: 'Track food waste per cafeteria daily.',
    status: 'In Discovery',
    priority: 'Medium',
    phase: 'P1',
    startDate: '2024-02-10',
    targetEndDate: '2024-05-15',
    lastUpdated: '2024-02-18',
    currentStep: 'Defining metrics with stakeholders.',
    nextSteps: 'Draft mockups.',
    p1Definition: { ...EMPTY_P1, completionPercentage: 30 },
    p2Definition: { ...EMPTY_P2 },
    p3Definition: { ...EMPTY_P3 },
    p4Definition: { ...EMPTY_P4 },
    playbookResponses: {},
    notes: '',
    documents: [],
    progress: 10
  }
];

// --- Mock Requests ---
export const REQUESTS: Request[] = [
  {
    id: 'req_1',
    requesterId: 'u3',
    requesterName: 'Jordan Customer',
    department: 'Transportation',
    background: 'We need to know late bus arrivals.',
    coreQuestion: 'How many buses are late >10 mins?',
    goals: 'A weekly report.',
    status: 'New',
    submittedAt: '2024-02-21'
  }
];

// --- Mock Reports ---
export const REPORTS: Report[] = [
  {
    id: 'rep_1',
    name: 'Daily Ridership',
    link: '#',
    department: 'Transportation',
    frequency: 'Daily',
    ownerId: 'u2',
    lastUpdated: '2024-02-22',
    active: true,
    type: 'Status Monitoring'
  },
  {
    id: 'rep_2',
    name: 'Meal Counts',
    link: '#',
    department: 'Food Services',
    frequency: 'Monthly',
    ownerId: 'u2',
    lastUpdated: '2024-02-01',
    active: true,
    type: 'Operational'
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'log_1', action: 'User Login', user: 'Sarah Manager', role: 'RAAD_MANAGER', details: 'Successful login via SSO', timestamp: '2024-02-25 08:30:12' },
];
