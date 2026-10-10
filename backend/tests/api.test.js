const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/config/db');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('DevOps API Test Suite', () => {
  let createdTaskId;

  describe('1. System Health & Monitoring Endpoints', () => {
    it('GET /health should return 200 and UP status for Docker/Jenkins healthcheck', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.database.status).toBe('CONNECTED');
    });

    it('GET /metrics should expose Prometheus scrape endpoint (Expt 7)', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('http_requests_total');
      expect(res.text).toContain('devops_app_');
    });

    it('GET /api/stats should return system telemetry and task counts', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
      expect(res.body.data).toHaveProperty('systemInfo');
    });
  });

  describe('2. Task CRUD & Jira Operations (Expt 6)', () => {
    it('POST /api/tasks should create a new Jira-style task', async () => {
      const newTask = {
        title: 'Implement Prometheus Alertmanager Rules',
        description: 'Configure high memory and error rate alert triggers',
        priority: 'HIGH',
        type: 'DEVOPS',
        sprint: 'Sprint 1',
        assignee: 'SRE Lead',
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.issueKey).toBeDefined();
      createdTaskId = res.body.data.id;
    });

    it('GET /api/tasks should retrieve list of tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('PATCH /api/tasks/:id/status should update task status across Kanban columns', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'IN_PROGRESS' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('DELETE /api/tasks/:id should remove task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
