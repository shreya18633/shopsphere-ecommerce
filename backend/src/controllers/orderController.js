const Order = require('../models/Order');
const Product = require('../models/Product');
const { ordersCounter, revenueCounter } = require('../middleware/metricsMiddleware');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, shippingAddress, items, totalAmount } = req.body;

    if (!items || !items.length || !customerName) {
      return res.status(400).json({ success: false, message: 'Customer name and cart items are required' });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const jiraIssueRef = `SHOP-ORD-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail: customerEmail || 'customer@example.com',
      shippingAddress: shippingAddress || '123 Market Street, Suite 400',
      totalAmount: parseFloat(totalAmount) || 0,
      status: 'PROCESSING',
      items,
      jiraIssueRef,
    });

    // Update Prometheus metrics for observability
    ordersCounter.inc();
    if (totalAmount) {
      revenueCounter.inc(parseFloat(totalAmount));
    }

    // Deduct stock for ordered products
    for (const item of items) {
      if (item.productId) {
        const prod = await Product.findByPk(item.productId);
        if (prod && prod.stock >= item.quantity) {
          await prod.update({ stock: prod.stock - item.quantity });
        }
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.update({ status });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
