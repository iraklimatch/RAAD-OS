
import { PROJECTS, REQUESTS, REPORTS, USERS } from '../constants';
import { Project, Request, Report, User, ProjectStatus } from '../types';

// Simple in-memory store
let projectsStore = [...PROJECTS];
let requestsStore = [...REQUESTS];
let reportsStore = [...REPORTS];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockBackend = {
  getProjects: async (): Promise<Project[]> => {
    await delay(300);
    return [...projectsStore];
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    await delay(200);
    return projectsStore.find(p => p.id === id);
  },

  createProject: async (project: Project): Promise<Project> => {
    await delay(400);
    projectsStore.push(project);
    return project;
  },

  updateProject: async (project: Project): Promise<Project> => {
    await delay(300);
    projectsStore = projectsStore.map(p => p.id === project.id ? project : p);
    return project;
  },

  getRequests: async (): Promise<Request[]> => {
    await delay(300);
    return [...requestsStore];
  },

  createRequest: async (req: Request): Promise<Request> => {
    await delay(400);
    requestsStore.push(req);
    return req;
  },

  updateRequestStatus: async (id: string, status: Request['status']): Promise<void> => {
    await delay(300);
    requestsStore = requestsStore.map(r => r.id === id ? { ...r, status } : r);
  },

  getReports: async (): Promise<Report[]> => {
    await delay(300);
    return [...reportsStore];
  },

  getUsers: async (): Promise<User[]> => {
    await delay(100);
    return [...USERS];
  }
};
