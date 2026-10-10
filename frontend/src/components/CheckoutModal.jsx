import React, { useState } from 'react';
import { X, CheckCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderPlaced }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        totalAmount: total,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const result = await onOrderPlaced(payload);
      setCompletedOrder(result.data);
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-sm" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {completedOrder ? 'Order Confirmed!' : 'Checkout & Place Order'}
          </h3>
          <button className="btn-secondary" style={{ padding: '0.3rem 0.5rem' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {completedOrder ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle size={32} color="#10b981" />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Thank You, {completedOrder.customerName}!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Your order has been recorded in the database and processed by our inventory service.
            </p>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Order ID:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{completedOrder.orderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{completedOrder.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Jira Issue Key:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#c084fc', fontWeight: 700 }}>
                  {completedOrder.jiraIssueRef || 'SHOP-ORD-402'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Total Charged:</span>
                <span style={{ color: '#f8fafc' }}>${completedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handleFinish}>
              <span>Continue Shopping</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                className="search-input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Shreya Khandelwal"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                className="search-input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="you@example.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Delivery Address *
              </label>
              <textarea
                required
                rows={2}
                className="search-input-field"
                style={{ paddingLeft: '1rem', borderRadius: 'var(--radius-md)' }}
                placeholder="House / Flat No., Street, City, Pincode"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              />
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                <span>Cart Items:</span>
                <span>{cartItems.length} items</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#38bdf8' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Processing Order...' : `Pay & Place Order ($${total.toFixed(2)})`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
