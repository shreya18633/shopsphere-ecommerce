const { connectDB } = require('./config/db');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Database connected, seeding E-Commerce catalog...');

    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });

    const products = [
      {
        sku: 'SHOP-ELEC-101',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with two processors and 8 microphones for crystal clear audio and hands-free calls.',
        price: 349.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        stock: 35,
        rating: 4.9,
        ratingCount: 128,
      },
      {
        sku: 'SHOP-ELEC-102',
        name: 'Apple Watch Series 9 GPS 45mm',
        description: 'Powerful S9 SiP chip, Double Tap gesture, brighter display, and advanced health tracking features.',
        price: 429.00,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        stock: 18,
        rating: 4.8,
        ratingCount: 95,
      },
      {
        sku: 'SHOP-ELEC-103',
        name: 'Keychron K2 Mechanical Gaming Keyboard',
        description: 'Wireless Bluetooth mechanical keyboard with RGB backlighting, hot-swappable Gateron G Pro switches.',
        price: 89.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        stock: 40,
        rating: 4.7,
        ratingCount: 64,
      },
      {
        sku: 'SHOP-ELEC-104',
        name: 'Dell UltraSharp 27" 4K HDR USB-C Hub Monitor',
        description: 'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color coverage, and 90W power delivery.',
        price: 499.50,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
        stock: 12,
        rating: 4.9,
        ratingCount: 47,
      },
      {
        sku: 'SHOP-ACC-201',
        name: 'Bellroy Classic Water-Resistant Commuter Backpack',
        description: 'Padded laptop sleeve for up to 16" devices, quick-access exterior valuables pocket, and contoured lumbar support.',
        price: 139.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        stock: 22,
        rating: 4.8,
        ratingCount: 83,
      },
      {
        sku: 'SHOP-ACC-202',
        name: 'Minimalist Titanium Automatic Chronograph Watch',
        description: 'Sapphire crystal face, Japanese automatic movement, genuine Italian leather strap, and 100m water resistance.',
        price: 219.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
        stock: 15,
        rating: 4.6,
        ratingCount: 39,
      },
      {
        sku: 'SHOP-APP-301',
        name: 'Nike Air Jordan 1 Retro High OG Sneakers',
        description: 'Iconic streetwear sneaker with premium full-grain leather, Air-Sole cushioning, and durable rubber traction.',
        price: 180.00,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        stock: 8,
        rating: 4.9,
        ratingCount: 210,
      },
      {
        sku: 'SHOP-APP-302',
        name: 'Heavyweight French Terry Organic Cotton Hoodie',
        description: 'Custom relaxed fit, 450 GSM ultra-dense combed cotton, preshrunk with ribbed side gussets.',
        price: 75.00,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
        stock: 50,
        rating: 4.7,
        ratingCount: 76,
      },
    ];

    for (const prod of products) {
      await Product.create(prod);
    }

    // Seed Demo Initial Orders
    await Order.create({
      orderNumber: 'ORD-891024',
      customerName: 'Alex Rivera',
      customerEmail: 'alex.rivera@example.com',
      shippingAddress: '742 Evergreen Terrace, Springfield',
      totalAmount: 439.98,
      status: 'DELIVERED',
      items: [
        { productId: 1, name: 'Sony WH-1000XM5 Wireless Headphones', price: 349.99, quantity: 1 },
        { productId: 3, name: 'Keychron K2 Mechanical Gaming Keyboard', price: 89.99, quantity: 1 },
      ],
      jiraIssueRef: 'SHOP-ORD-101',
    });

    await Order.create({
      orderNumber: 'ORD-992147',
      customerName: 'Maya Patel',
      customerEmail: 'maya.patel@example.com',
      shippingAddress: '456 Innovation Way, San Francisco, CA',
      totalAmount: 180.00,
      status: 'PROCESSING',
      items: [
        { productId: 7, name: 'Nike Air Jordan 1 Retro High OG Sneakers', price: 180.00, quantity: 1 },
      ],
      jiraIssueRef: 'SHOP-ORD-102',
    });

    console.log(`[Seed] Seeded ${products.length} products and 2 demo orders successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
