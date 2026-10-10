const Product = require('../models/Product');
const { productsGauge } = require('../middleware/metricsMiddleware');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    let products = await Product.findAll({
      where,
      order: sort === 'price_asc' ? [['price', 'ASC']] :
             sort === 'price_desc' ? [['price', 'DESC']] :
             sort === 'rating' ? [['rating', 'DESC']] : [['createdAt', 'DESC']],
    });

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Refresh gauge
    productsGauge.set(products.length);

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const count = await Product.count();
    const sku = req.body.sku || `SHOP-${1000 + count + 1}`;

    const product = await Product.create({
      sku,
      name,
      description: description || 'High quality item verified by store.',
      price: parseFloat(price),
      category: category || 'Electronics',
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      stock: stock ? parseInt(stock) : 20,
      rating: rating ? parseFloat(rating) : 4.8,
    });

    const total = await Product.count();
    productsGauge.set(total);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update(req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    const total = await Product.count();
    productsGauge.set(total);

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
