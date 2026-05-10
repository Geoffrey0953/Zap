import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BUILDINGS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './BuildingDetail.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};

const MOCK_REVIEWS = [
  { author: 'Anteater Zot', rating: 4, text: 'Great food but can get crowded at lunch.', time: '2d ago' },
  { author: 'Bob H.', rating: 5, text: 'Best spot on campus! Always clean and organized.', time: '1w ago' },
  { author: 'Sarah M.', rating: 3, text: 'Hours could be longer on weekends.', time: '2w ago' },
];

export default function BuildingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);

  const building = BUILDINGS.find(b => b.id === id);

  if (!building) {
    return (
      <div className="bdetail-notfound">
        <h2>Building not found</h2>
        <Link to="/directory/buildings">← Back to Directory</Link>
      </div>
    );
  }

  const color = categoryColors[building.category] || categoryColors.default;

  const handleSave = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSaved(s => !s);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert(`Review submitted! (wire up with backend later)\n"${reviewText}" — ${reviewRating}★`);
    setShowReviewForm(false);
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="bdetail-page">

      {/* Header bar */}
      <div className="bdetail-topbar">
        <button className="bdetail-back" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <button
          className={`bdetail-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          title={saved ? 'Remove from saved' : 'Save this place'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'var(--teal)' : 'none'} stroke={saved ? 'var(--teal)' : 'currentColor'} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Mini Map */}
      <div className="bdetail-map">
        <MapContainer
          center={[building.lat, building.lng]}
          zoom={17}
          className="bdetail-leaflet"
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[building.lat, building.lng]}>
            <Popup>{building.name}</Popup>
          </Marker>
        </MapContainer>
        <div className="bdetail-map-overlay" onClick={() => navigate('/map')} title="Open full map" />
        <button className="bdetail-full-map" onClick={() => navigate('/map')}>
          Open full map ↗
        </button>
      </div>

      <div className="bdetail-body">

        {/* Title section */}
        <div className="bdetail-title-section">
          <div className="bdetail-badges">
            <span className="bdetail-badge" style={{ background: color + '22', color }}>
              {building.category}
            </span>
            {building.departments.length > 0 && (
              <span className="bdetail-badge dept-badge">Academic</span>
            )}
          </div>
          <h1 className="bdetail-name">{building.name}</h1>
          <p className="bdetail-abbr">{building.abbr} · UCI Campus</p>
        </div>

        {/* Info cards */}
        <div className="bdetail-info-grid">
          <div className="info-card">
            <span className="info-card-icon">🕐</span>
            <div>
              <span className="info-card-label">Hours</span>
              <span className="info-card-value">{building.hours}</span>
            </div>
          </div>
          <div className="info-card">
            <span className="info-card-icon">📍</span>
            <div>
              <span className="info-card-label">Location</span>
              <span className="info-card-value">UCI Main Campus</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bdetail-section">
          <h2>About</h2>
          <p className="bdetail-desc">{building.description}</p>
        </div>

        {/* Departments */}
        {building.departments.length > 0 && (
          <div className="bdetail-section">
            <h2>Departments</h2>
            <div className="dept-list">
              {building.departments.map(d => (
                <Link key={d} to="/directory/departments" className="dept-item">
                  <span>📚 {d}</span>
                  <span className="dept-item-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="bdetail-actions">
          <button
            className="action-btn primary"
            onClick={() => navigate(`/directions?to=${building.id}`)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Get Directions
          </button>
          <button
            className="action-btn ghost"
            onClick={() => setShowReviewForm(v => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Write Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="review-form-card">
            <h3>Write a Review</h3>
            <p className="review-form-place">{building.name}</p>

            <div className="star-picker">
              <p>How was your experience?</p>
              <div className="stars-input">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    className={`star-btn ${s <= (hoveredStar || reviewRating) ? 'filled' : ''}`}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setReviewRating(s)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="review-form">
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                required
              />
              <div className="review-form-btns">
                <button type="button" className="rfbtn-cancel" onClick={() => setShowReviewForm(false)}>Cancel</button>
                <button type="submit" className="rfbtn-submit">Post Review</button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews */}
        <div className="bdetail-section">
          <div className="reviews-header">
            <h2>Reviews</h2>
            <div className="avg-rating">
              <span className="avg-number">4.2</span>
              <div className="avg-stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`star ${s <= 4 ? 'filled' : ''}`}>★</span>
                ))}
              </div>
            </div>
          </div>

          <div className="reviews-list">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-item-top">
                  <div className="reviewer-avatar">{r.author[0]}</div>
                  <div className="reviewer-info">
                    <span className="reviewer-name">{r.author}</span>
                    <div className="reviewer-meta">
                      <div className="r-stars">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`star ${s <= r.rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                      <span className="r-time">{r.time}</span>
                    </div>
                  </div>
                </div>
                <p className="review-item-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
