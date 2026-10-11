import React from 'react';
import { ShoppingBag, Search, ShoppingCart, Package, Server, Terminal, Sparkles, Activity } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenDevOps,
  healthStatus,
}) {
  const isHealthy = healthStatus && healthStatus.status === 'UP';

  return (
    <header className="store-navbar">
      <div className="brand-wrap" onClick={() => setSearchTerm('')}>
        <div className="brand-logo-icon">
          <ShoppingBag size={22} color="#ffffff" />
        </div>
        <div>
          <span className="brand-text-title">ShopSphere</span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
            Full-Stack Market
          </span>
        </div>
      </div>

      <div className="nav-search-bar">
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search products, brands, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="nav-right-actions">
        {/* Live Backend Telemetry Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: isHealthy ? '#34d399' : '#f87171',
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#10b981' : '#ef4444',
          }} />
          <span>{isHealthy ? `API: UP (${healthStatus.database?.dialect})` : 'Connecting...'}</span>
        </div>

        {/* DevOps Console Button */}
        <button className="btn-devops-pill" onClick={onOpenDevOps}>
          <Server size={15} />
          <span>DevOps Console</span>
        </button>

        {/* Orders History Button */}
        <button className="btn-secondary" onClick={onOpenOrders} title="View Orders">
          <Package size={16} />
          <span>Orders</span>
        </button>

        {/* Cart Button */}
        <button className="btn-primary" onClick={onOpenCart} style={{ position: 'relative' }}>
          <ShoppingCart size={17} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={{
              background: '#f43f5e',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 800,
              borderRadius: '9999px',
              padding: '0.1rem 0.45rem',
              marginLeft: '0.2rem',
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
