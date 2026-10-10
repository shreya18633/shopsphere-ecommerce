const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');

router.get('/', async (req, res) => {
  let dbStatus = 'DISCONNECTED';
  try {
    await sequelize.authenticate();
    dbStatus = 'CONNECTED';
  } catch (err) {
    dbStatus = 'ERROR';
  }

  const isHealthy = dbStatus === 'CONNECTED';
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? 'UP' : 'DOWN',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      dialect: sequelize.getDialect(),
    },
    version: '1.0.0',
    service: 'devops-fullstack-backend',
  });
});

module.exports = router;
