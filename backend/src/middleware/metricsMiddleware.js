const client = require('prom-client');

// Initialize registry
const register = new client.Registry();

// Add default system metrics (CPU, Memory, Event Loop, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'devops_app_',
});

// Custom HTTP requests total counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// Custom HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Custom Task Gauges for business monitoring
const tasksGauge = new client.Gauge({
  name: 'devops_tasks_count',
  help: 'Current number of tasks categorized by status',
  labelNames: ['status'],
});
register.registerMetric(tasksGauge);

// Middleware function to track latency and counts
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
    
    // Normalize path to avoid high cardinality route labels
    const route = req.route ? req.baseUrl + req.route.path : req.path;
    const statusCode = res.statusCode.toString();

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });

    httpRequestDuration.observe({
      method: req.method,
      route,
      status_code: statusCode,
    }, durationSeconds);
  });

  next();
};

module.exports = {
  register,
  metricsMiddleware,
  tasksGauge,
};
