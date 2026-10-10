import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import DevOpsModal from './components/DevOpsModal';
import { api } from './services/api';
import { ShoppingBag, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Apparel'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);

  // Modals / Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDevOpsOpen, setIsDevOpsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Initial Store Data
  const loadData = async () => {
    try {
      const [prodsRes, ordersRes, statsRes, healthRes] = await Promise.allSettled([
        api.getProducts(),
        api.getOrders(),
        api.getStats(),
        api.getHealth(),
      ]);

      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || null);
      if (healthRes.status === 'fulfilled') setHealthStatus(healthRes.value || null);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Polling for telemetry
    return () => clearInterval(interval);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = async (orderPayload) => {
    const res = await api.createOrder(orderPayload);
    setCartItems([]);
    await loadData();
    return res;
  };

  // Filter Products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenDevOps={() => setIsDevOpsOpen(true)}
        healthStatus={healthStatus}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
        <HeroBanner onOpenDevOps={() => setIsDevOpsOpen(true)} />

        {/* Category Filter Pills */}
        <div className="category-filter-bar">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            Showing {filteredProducts.length} of {products.length} Products
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)' }}>
            <p>Connecting to E-Commerce Database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No products found</p>
            <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isItemInCart={cartItems.some((i) => i.id === product.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* DevOps Laboratory Suite Modal */}
      <DevOpsModal
        isOpen={isDevOpsOpen}
        onClose={() => setIsDevOpsOpen(false)}
        stats={stats}
        healthStatus={healthStatus}
      />
    </div>
  );
}
