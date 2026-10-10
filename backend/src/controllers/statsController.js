const os = require('os');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStoreStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const orders = await Order.findAll({ attributes: ['totalAmount', 'status'] });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const lowStockCount = await Product.count({ where: { stock: { [require('sequelize').Op.lt]: 10 } } });

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
      domain: 'E-Commerce / Online Marketplace',
    };

    res.json({
      success: true,
      data: {
        store: {
          totalProducts,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          lowStockCount,
        },
        systemInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
