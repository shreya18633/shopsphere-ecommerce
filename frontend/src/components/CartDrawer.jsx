import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = discountedSubtotal > 50 || discountedSubtotal === 0 ? 0 : 9.99;
  const total = discountedSubtotal + shipping;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DEVOPS20' || code === 'MAHEK20') {
      setDiscountPercent(20);
      setPromoMessage('Promo code applied: 20% OFF!');
    } else if (code === 'FREESHIP') {
      setDiscountPercent(10);
      setPromoMessage('Promo code applied: 10% OFF!');
    } else {
      setDiscountPercent(0);
      setPromoMessage('Invalid coupon code. Try DEVOPS20');
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Your Shopping Cart</h3>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)'
            }}>
              {cartItems.length} items
            </span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.825rem', marginTop: '0.4rem' }}>Browse our catalog and add items to checkout.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.2rem' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700 }}>
                    ${item.price.toFixed(2)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.4rem',
                    }}>
                      <button
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem' }}
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Input - Implemented by Mahek */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. DEVOPS20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.6rem 0.45rem 2rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.45rem 0.8rem' }}
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <div style={{
                fontSize: '0.725rem',
                color: discountPercent > 0 ? '#34d399' : '#f87171',
                marginTop: '-0.4rem',
              }}>
                {promoMessage}
              </div>
            )}

            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: '#34d399' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#34d399' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={onProceedCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
