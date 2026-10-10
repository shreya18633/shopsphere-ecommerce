require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { metricsMiddleware } = require('./middleware/metricsMiddleware');

const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const healthRoutes = require('./routes/healthRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const statsController = require('./controllers/statsController');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());

// Prometheus Metrics Middleware (captures HTTP traffic for Expt 7)
app.use(metricsMiddleware);

// API Documentation & Root Endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'DevOps Full-Stack Platform API',
    version: '1.0.0',
    description: 'REST API supporting Git, Docker, Jenkins CI/CD, and Prometheus Monitoring',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      tasks: '/api/tasks',
      projects: '/api/projects',
      stats: '/api/stats',
    },
    documentation: 'See README.md and EXPERIMENTS_GUIDE.md',
  });
});

// Mount Routes
app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.get('/api/stats', statsController.getSystemStats);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Connect database and start listening
let server;
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'test') {
      server = app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 DevOps Backend API running on http://localhost:${PORT}`);
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
