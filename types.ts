
export type Role = 'RAAD_ANALYST' | 'RAAD_MANAGER' | 'DEPARTMENT_CUSTOMER' | 'ADMIN';

export type ProjectStatus = 'Backlog' | 'In Discovery' | 'In Progress' | 'On Hold' | 'Completed' | 'Archived';
export type ProjectPhase = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type ProjectType = 'Reporting' | 'Dashboard' | 'Project' | 'Process Improvement';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
}

// --- Playbook & Generic ---
export interface PlaybookItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export interface PlaybookPhase {
  id: ProjectPhase;
  title: string;
  items: PlaybookItem[];
}

export interface PlaybookResponse {
  itemId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  notes?: string;
  completedBy?: string;
  completedAt?: string;
}

// --- P1 Specific Structures ---
export type StakeholderRole = 'Client' | 'Sponsor' | 'Owner' | 'Team Member';
export type InviteStatus = 'Pending' | 'Accepted' | 'Declined';

export interface ProjectStakeholder {
  userId: string;
  role: StakeholderRole;
  status: InviteStatus;
  invitedAt?: string;
}

export interface P1Definition {
  background: string;
  goals: string;
  coreQuestion: string;
  successDefinition: string;
  relevantMetrics: string;
  targetAudience: string;
  inScope: string;
  outScope: string;
  stakeholders: ProjectStakeholder[];
  startDate: string;
  endDate: string;
  otherDates: string;
  budgetNonRecurring: string;
  budgetRecurring: string;
  constraints: string;
  assumptions: string;
  risksDependencies: string;
  clientSignOff: {
    status: 'Pending' | 'Approved' | 'Requested Changes';
    feedback?: string;
    signedBy?: string; 
    signedAt?: string;
  };
  lastUpdated: string;
  completionPercentage: number;
}

// --- P2 Data Prep Structures ---
export interface P2Definition {
  dataSourceId: string;
  accessNeeded: string;
  format: string;
  betterAlternatives: string;
  
  extractionReproducible: string; // SQL, Python, etc.
  reportLevelFilters: string;
  manipulation: string;
  automationOpportunity: string;

  cleaningSteps: string; // Sent to Matt AI
  
  calcFieldsStrategy: string;
  missingValuesStrategy: string;
  
  validationSanityCheck: boolean;
  validationEdgeCase: boolean;
  validationCheckpoint: boolean;
  
  completionPercentage: number;
}

// --- P3 Analysis Structures ---
export interface P3Definition {
  questionsToAnswer: string;
  keyDeliverable: string;
  
  codeReviewDone: boolean;
  logicReviewDone: boolean;
  adaptations: string;
  
  deliveryMethod: 'Final Report (P4-A)' | 'Dashboard Prototype (P4-B)' | '';
  
  completionPercentage: number;
}

// --- P4 Specific Structures ---
export interface P4ADefinition { // Static
  updateFrequency: string;
  keyMetricJustification: string;
  deliveryMethod: string; // Written, Viz, Doc
  accessibilityRequirements: string;
  communicationList: string;
}

export interface WidgetDef {
  id: string;
  metric: string;
  chartType: string;
  description: string;
  requiredFields: string;
}

export interface FilterDef {
  id: string;
  field: string;
  dbField: string;
  notes: string;
}

export interface P4BDefinition { // Prototype
  functionalityDecision: 'Functional' | 'Mockup';
  prototypeType: string;
  dataFreshness: string;
  
  widgets: WidgetDef[];
  filters: FilterDef[];
  
  engineeringAccess: string;
  engineeringDataModel: string; // Fact/Dimension details
  
  userFeedbackAction: string;
  
  dotsHandoff: {
    prototypeFile: boolean;
    dataSources: boolean;
    calcLogic: boolean;
    refreshCadence: boolean;
    ticketNumber: string;
  };
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  department: string;
  analyticsLeadId?: string;
  supportingAnalystIds: string[];
  description: string;
  status: ProjectStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Weekly Priority';
  phase: ProjectPhase;
  startDate: string;
  targetEndDate: string;
  lastUpdated: string;
  currentStep: string;
  nextSteps: string;
  
  // Phase Definitions
  p1Definition: P1Definition;
  p2Definition: P2Definition;
  p3Definition: P3Definition;
  p4Definition: {
     mode: 'A' | 'B' | null;
     p4a: P4ADefinition;
     p4b: P4BDefinition;
  };

  playbookResponses: Record<string, PlaybookResponse>; 
  
  notes: string;
  documents: { name: string; url: string }[];
  progress: number;
}

export interface Request {
  id: string;
  requesterId: string;
  requesterName: string;
  department: string;
  background: string;
  coreQuestion: string;
  goals: string;
  status: 'New' | 'Approved' | 'Declined' | 'More Info Needed';
  submittedAt: string;
}

export interface Report {
  id: string;
  name: string;
  link: string;
  department: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Ad-hoc';
  ownerId: string;
  lastUpdated: string;
  active: boolean;
  type: string;
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: Role;
  details: string;
  timestamp: string;
}
