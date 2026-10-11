import React, { useState } from 'react';
import { X, Star, MessageSquare, ThumbsUp, CheckCircle, Plus } from 'lucide-react';

export default function ReviewsModal({ isOpen, onClose, product }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Aarav Sharma',
      rating: 5,
      date: '2 days ago',
      comment: 'Top tier build quality. Audio resolution is crystal clear and matches the description perfectly!',
      likes: 12,
    },
    {
      id: 2,
      author: 'Priya Verma',
      rating: 4,
      date: '1 week ago',
      comment: 'Fast shipping and well packaged. Battery life is fantastic for daily work commute.',
      likes: 8,
    },
  ]);

  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setReviews([
        {
          id: Date.now(),
          author: newAuthor,
          rating: parseInt(newRating),
          date: 'Just now',
          comment: newComment,
          likes: 0,
        },
        ...reviews,
      ]);
      setNewAuthor('');
      setNewComment('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Customer Reviews & Ratings</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Reviews for: <strong>{product.name}</strong>
            </p>
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Write Review Form - Contributed by Khushboo */}
        <form onSubmit={handleAddReview} style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem' }}>Write a Customer Review</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <input
              type="text"
              required
              placeholder="Your Name (e.g. Khushboo)"
              className="search-input-field"
              style={{ paddingLeft: '0.85rem' }}
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />

            <select
              className="search-input-field"
              style={{ paddingLeft: '0.85rem', cursor: 'pointer' }}
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
            >
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
          </div>

          <textarea
            required
            rows={2}
            placeholder="Share your experience with this product..."
            className="search-input-field"
            style={{ paddingLeft: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.6rem' }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }} disabled={isSubmitting}>
            <Plus size={14} />
            <span>Submit Review</span>
          </button>
        </form>

        {/* Existing Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '350px', overflowY: 'auto' }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{rev.author}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle size={11} /> Verified Buyer
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < rev.rating ? '#fbbf24' : 'transparent'}
                      color={i < rev.rating ? '#fbbf24' : 'var(--text-muted)'}
                    />
                  ))}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>{rev.date}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
