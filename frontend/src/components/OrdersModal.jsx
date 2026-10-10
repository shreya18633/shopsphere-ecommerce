import React from 'react';
import { X, Package, Clock, CheckCircle2, Truck, ExternalLink } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Store Order History</h3>
            <span style={{
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {orders.length} Orders
            </span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
            <p>No orders recorded yet. Place an order from the store!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>
                          {order.orderNumber}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: order.status === 'DELIVERED' ? '#34d399' : '#38bdf8',
                          border: `1px solid ${order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Customer: {order.customerName} ({order.customerEmail})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                        ${order.totalAmount?.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
                        Jira: {order.jiraIssueRef || 'SHOP-ORD-101'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    {items.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {item.name} &times; {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
