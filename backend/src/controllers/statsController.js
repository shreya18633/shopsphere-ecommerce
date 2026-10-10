const os = require('os');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getSystemStats = async (req, res) => {
  try {
    const totalTasks = await Task.count();
    const todoCount = await Task.count({ where: { status: 'TODO' } });
    const inProgressCount = await Task.count({ where: { status: 'IN_PROGRESS' } });
    const inReviewCount = await Task.count({ where: { status: 'IN_REVIEW' } });
    const doneCount = await Task.count({ where: { status: 'DONE' } });

    const criticalCount = await Task.count({ where: { priority: 'CRITICAL' } });
    const highCount = await Task.count({ where: { priority: 'HIGH' } });
    const mediumCount = await Task.count({ where: { priority: 'MEDIUM' } });
    const lowCount = await Task.count({ where: { priority: 'LOW' } });

    const totalProjects = await Project.count();

    const systemInfo = {
      platform: os.platform(),
      hostname: os.hostname(),
      uptimeSeconds: Math.floor(os.uptime()),
      nodeUptimeSeconds: Math.floor(process.uptime()),
      memory: {
        totalMB: Math.round(os.totalmem() / 1024 / 1024),
        freeMB: Math.round(os.freemem() / 1024 / 1024),
        usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      },
      processMemory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      environment: process.env.NODE_ENV || 'development',
      dbDialect: process.env.DB_DIALECT || (process.env.DB_HOST ? 'postgres' : 'sqlite'),
      monitoringEnabled: true,
      prometheusEndpoint: '/metrics',
      jenkinsWebhookStatus: 'Configured',
    };

    res.json({
      success: true,
      data: {
        summary: {
          totalTasks,
          todoCount,
          inProgressCount,
          inReviewCount,
          doneCount,
          criticalCount,
          highCount,
          mediumCount,
          lowCount,
          totalProjects,
          completionRate: totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0,
        },
        systemInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
