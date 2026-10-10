const API_BASE = '/api';

export const api = {
  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id, data) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task status');
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  // System Stats & DevOps Telemetry
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch system stats');
    return res.json();
  },

  // Healthcheck for Docker/Jenkins monitoring
  async getHealth() {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health check returned non-200');
    return res.json();
  },

  // Raw Prometheus metrics
  async getMetrics() {
    const res = await fetch('/metrics');
    if (!res.ok) throw new Error('Failed to fetch Prometheus metrics');
    return res.text();
  },
};
