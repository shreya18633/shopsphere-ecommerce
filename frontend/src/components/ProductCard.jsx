import React from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isItemInCart }) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
          }}
        />
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="product-rating">
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.ratingCount})</span>
          </div>

          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: product.stock > 10 ? '#34d399' : '#fbbf24',
          }}>
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </span>
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-bottom-row">
          <span className="product-price-val">${product.price.toFixed(2)}</span>
          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product)}
            style={{
              backgroundColor: isItemInCart ? '#10b981' : 'var(--primary)',
            }}
          >
            {isItemInCart ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
