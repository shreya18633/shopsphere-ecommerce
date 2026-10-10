const express = require('express');
const router = express.Router();
const { register } = require('../middleware/metricsMiddleware');

router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
