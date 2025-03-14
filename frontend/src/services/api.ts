const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hosseinabdi7.github.io/cursor-ai-project/api'  // Update this with your production API URL
  : 'http://localhost:3000/api';

export interface Project {
  id: number;
  name: string;
  description?: string;
  levels: Level[];
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  order: number;
  projectId: number;
}

export const api = {
  // Project endpoints
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  async createProject(data: { name: string; description?: string }): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  async updateProject(id: number, data: { name: string; description?: string }): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  },

  // Level endpoints
  async getLevels(projectId: number): Promise<Level[]> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/levels`);
    if (!response.ok) throw new Error('Failed to fetch levels');
    return response.json();
  },

  async createLevel(projectId: number, data: { name: string; description?: string; order: number }): Promise<Level> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/levels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create level');
    return response.json();
  },

  async updateLevel(id: number, data: { name?: string; description?: string; status?: Level['status']; order?: number }): Promise<Level> {
    const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update level');
    return response.json();
  },

  async deleteLevel(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete level');
  },
}; 