import { supabaseFetch } from './supabaseClient';
import { Project, Request, Report, User } from '../types';

// Helpers to map between camelCase app objects and snake_case Postgres columns
const projectToRow = (p: Project) => ({
  id: p.id,
  name: p.name,
  type: p.type,
  department: p.department,
  analytics_lead_id: p.analyticsLeadId,
  supporting_analyst_ids: p.supportingAnalystIds,
  description: p.description,
  status: p.status,
  priority: p.priority,
  phase: p.phase,
  start_date: p.startDate,
  target_end_date: p.targetEndDate,
  last_updated: p.lastUpdated,
  current_step: p.currentStep,
  next_steps: p.nextSteps,
  p1_definition: p.p1Definition,
  p2_definition: p.p2Definition,
  p3_definition: p.p3Definition,
  p4_definition: p.p4Definition,
  playbook_responses: p.playbookResponses,
  notes: p.notes,
  documents: p.documents,
  progress: p.progress,
});

const projectFromRow = (r: any): Project => ({
  id: r.id,
  name: r.name,
  type: r.type,
  department: r.department,
  analyticsLeadId: r.analytics_lead_id,
  supportingAnalystIds: r.supporting_analyst_ids || [],
  description: r.description,
  status: r.status,
  priority: r.priority,
  phase: r.phase,
  startDate: r.start_date,
  targetEndDate: r.target_end_date,
  lastUpdated: r.last_updated,
  currentStep: r.current_step,
  nextSteps: r.next_steps,
  p1Definition: r.p1_definition,
  p2Definition: r.p2_definition,
  p3Definition: r.p3_definition,
  p4Definition: r.p4_definition,
  playbookResponses: r.playbook_responses || {},
  notes: r.notes,
  documents: r.documents || [],
  progress: r.progress ?? 0,
});

const requestToRow = (req: Request) => ({
  id: req.id,
  requester_id: req.requesterId,
  requester_name: req.requesterName,
  department: req.department,
  background: req.background,
  core_question: req.coreQuestion,
  goals: req.goals,
  status: req.status,
  submitted_at: req.submittedAt,
});

const requestFromRow = (r: any): Request => ({
  id: r.id,
  requesterId: r.requester_id,
  requesterName: r.requester_name,
  department: r.department,
  background: r.background,
  coreQuestion: r.core_question,
  goals: r.goals,
  status: r.status,
  submittedAt: r.submitted_at,
});

const reportFromRow = (r: any): Report => ({
  id: r.id,
  name: r.name,
  link: r.link,
  department: r.department,
  frequency: r.frequency,
  ownerId: r.owner_id,
  lastUpdated: r.last_updated,
  active: r.active,
  type: r.type,
});

const userFromRow = (r: any): User => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
  department: r.department,
  avatarUrl: r.avatar_url,
});

export const SupabaseBackend = {
  async getProjects(): Promise<Project[]> {
    const rows = await supabaseFetch<any[]>('/projects?select=*&order=last_updated.desc');
    return rows.map(projectFromRow);
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    const rows = await supabaseFetch<any[]>(`/projects?select=*&id=eq.${id}`);
    return rows?.[0] ? projectFromRow(rows[0]) : undefined;
  },

  async createProject(project: Project): Promise<Project> {
    const rows = await supabaseFetch<any[]>('/projects', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(projectToRow(project))
    });
    return projectFromRow(rows[0]);
  },

  async updateProject(project: Project): Promise<Project> {
    const rows = await supabaseFetch<any[]>(`/projects?id=eq.${project.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(projectToRow(project))
    });
    return projectFromRow(rows[0]);
  },

  async getRequests(): Promise<Request[]> {
    const rows = await supabaseFetch<any[]>('/requests?select=*&order=submitted_at.desc');
    return rows.map(requestFromRow);
  },

  async createRequest(req: Request): Promise<Request> {
    const rows = await supabaseFetch<any[]>('/requests', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(requestToRow(req))
    });
    return requestFromRow(rows[0]);
  },

  async updateRequestStatus(id: string, status: Request['status']): Promise<void> {
    await supabaseFetch(`/requests?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status })
    });
  },

  async getReports(): Promise<Report[]> {
    const rows = await supabaseFetch<any[]>('/reports?select=*&order=last_updated.desc');
    return rows.map(reportFromRow);
  },

  async getUsers(): Promise<User[]> {
    const rows = await supabaseFetch<any[]>('/users?select=*');
    return rows.map(userFromRow);
  }
};

