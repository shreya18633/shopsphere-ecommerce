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

describe('E-Commerce & DevOps API Test Suite', () => {
  let createdProductId;

  describe('1. System Health & Prometheus Telemetry (Expt 7)', () => {
    it('GET /health should return 200 UP status for Docker & Jenkins health checks', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.database.status).toBe('CONNECTED');
    });

    it('GET /metrics should expose Prometheus scrape metrics for monitoring', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('http_requests_total');
      expect(res.text).toContain('ecommerce_app_');
    });

    it('GET /api/stats should return store revenue and server metrics', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('store');
      expect(res.body.data).toHaveProperty('systemInfo');
    });
  });

  describe('2. E-Commerce Product Catalog CRUD', () => {
    it('POST /api/products should add a new product with SKU', async () => {
      const newProduct = {
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Quiet clicks and 8K DPI any-surface tracking with MagSpeed scroll wheel.',
        price: 99.99,
        category: 'Electronics',
        stock: 50,
      };

      const res = await request(app)
        .post('/api/products')
        .send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newProduct.name);
      expect(res.body.data.sku).toBeDefined();
      createdProductId = res.body.data.id;
    });

    it('GET /api/products should list all catalog items', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('3. Checkout & Order Processing (Expt 6 Jira Traceability)', () => {
    it('POST /api/orders should process a customer order and deduct stock', async () => {
      const orderPayload = {
        customerName: 'Jordan Smith',
        customerEmail: 'jordan@example.com',
        shippingAddress: '100 Silicon Blvd, Austin, TX',
        totalAmount: 99.99,
        items: [
          { productId: createdProductId, name: 'Logitech MX Master 3S', price: 99.99, quantity: 1 }
        ],
      };

      const res = await request(app)
        .post('/api/orders')
        .send(orderPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBeDefined();
      expect(res.body.data.status).toBe('PROCESSING');
    });

    it('GET /api/orders should retrieve orders list', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
