require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { metricsMiddleware } = require('./middleware/metricsMiddleware');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const taskRoutes = require('./routes/taskRoutes');
const healthRoutes = require('./routes/healthRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const statsController = require('./controllers/statsController');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());

// Prometheus Metrics Middleware (captures HTTP traffic for telemetry)
app.use(metricsMiddleware);

// API Root Documentation
app.get('/', (req, res) => {
  res.json({
    app: 'ShopSphere — Full-Stack E-Commerce & DevOps Platform API',
    domain: 'E-Commerce / Online Marketplace',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      products: '/api/products',
      orders: '/api/orders',
      stats: '/api/stats',
    },
    devopsIntegration: 'Docker Compose, Jenkins CI/CD, Git/GitHub, Jira, Prometheus/Grafana',
  });
});

// Mount Routes
app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/api/stats', statsController.getStoreStats);

// Direct Report PDF Download Route
app.get('/download-report', (req, res) => {
  const path = require('path');
  const filePath = path.join(__dirname, '../../Agile_DevOps_Lab_Report_ShopSphere.pdf');
  res.download(filePath, 'Agile_DevOps_Lab_Report_ShopSphere.pdf');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Bootstrap server
let server;
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'test') {
      server = app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🛍️  ShopSphere E-Commerce API running on http://localhost:${PORT}`);
        console.log(`📊 Prometheus Metrics available at http://localhost:${PORT}/metrics`);
        console.log(`🩺 Healthcheck endpoint at http://localhost:${PORT}/health`);
        console.log(`====================================================`);
      });
    }
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
