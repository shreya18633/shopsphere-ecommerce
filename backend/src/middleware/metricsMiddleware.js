const client = require('prom-client');

const register = new client.Registry();

// Default system metrics (CPU, Memory, Event Loop)
client.collectDefaultMetrics({
  register,
  prefix: 'ecommerce_app_',
});

// Custom HTTP request total counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed by E-Commerce API',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// Custom HTTP latency histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Business Metrics for E-Commerce Domain (Expt 7)
const ordersCounter = new client.Counter({
  name: 'ecommerce_orders_total',
  help: 'Total number of checkout orders placed',
});
register.registerMetric(ordersCounter);

const revenueCounter = new client.Counter({
  name: 'ecommerce_revenue_dollars_total',
  help: 'Total revenue processed in USD',
});
register.registerMetric(revenueCounter);

const productsGauge = new client.Gauge({
  name: 'ecommerce_products_count',
  help: 'Total number of products in store catalog',
});
register.registerMetric(productsGauge);

// Middleware function
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
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
  ordersCounter,
  revenueCounter,
  productsGauge,
};
