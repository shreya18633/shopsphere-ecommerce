// In development on port 3000, call the Express backend on port 5000 directly.
// In production (Docker / Nginx), use relative paths.
const BACKEND_URL = (typeof window !== 'undefined' && window.location.port === '3000')
  ? 'http://localhost:5000'
  : '';

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BACKEND_URL}/api/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${BACKEND_URL}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(data) {
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
  },

  // Store & Server Stats
  async getStats() {
    const res = await fetch(`${BACKEND_URL}/api/stats`);
    if (!res.ok) throw new Error('Failed to fetch store stats');
    return res.json();
  },

  // Health
  async getHealth() {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Prometheus Metrics
  async getMetrics() {
    const res = await fetch(`${BACKEND_URL}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.text();
  },
};
