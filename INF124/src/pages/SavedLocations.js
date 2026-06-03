import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildings } from '../hooks/useBuildings';
import { apiFetch } from '../api/client';
import { getToken } from '../context/AuthContext';
import './SavedLocations.css';

const LISTS = ['All', 'Study', 'Food', 'Outdoor'];

const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};

export default function SavedLocations() {
  const [activeList, setActiveList] = useState('All');
  const [savedItems, setSavedItems] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState(null);
  const { buildings, loading, error } = useBuildings();
  const navigate = useNavigate();

  const token = getToken();

  // Fetch saved locations from API
  const fetchSaved = useCallback(async () => {
    if (!token) {
      setSavedLoading(false);
      setSavedItems([]);
      return;
    }
    setSavedLoading(true);
    setSavedError(null);
    try {
      const data = await apiFetch('/saved', { token });
      setSavedItems(data.data || []);
    } catch (err) {
      setSavedError(err.message);
    } finally {
      setSavedLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  // Compute list counts from real data
  const listCounts = {};
  savedItems.forEach(s => {
    listCounts[s.list] = (listCounts[s.list] || 0) + 1;
  });

  // Merge saved items with building data (API already populates building, but fallback to buildings hook)
  const filteredSaved = savedItems
    .filter(s => activeList === 'All' || s.list === activeList)
    .map(s => ({
      ...s,
      building: s.building || buildings.find(b => b.id === s.buildingId),
      savedId: s._id, // MongoDB _id for DELETE
    }))
    .filter(s => s.building);

  // Format relative time
  const formatSavedAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const saved = new Date(dateStr);
    const diffMs = now - saved;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${diffWeeks}w ago`;
  };

  const removeSaved = async (savedId, e) => {
    e.stopPropagation();
    if (!token) return;
    try {
      await apiFetch(`/saved/${savedId}`, { method: 'DELETE', token });
      // Remove from local state
      setSavedItems(prev => prev.filter(s => s._id !== savedId));
    } catch (err) {
      alert(`Failed to remove: ${err.message}`);
    }
  };

  // Overall loading state
  if (savedLoading || loading) {
    return <div className="saved-page"><div className="saved-container"><p>Loading saved places…</p></div></div>;
  }

  if (savedError || error) {
    return <div className="saved-page"><div className="saved-container"><p>Error: {savedError || error}</p></div></div>;
  }

  return (
    <div className="saved-page">
      <div className="saved-container">

        {/* Header */}
        <div className="saved-header">
          <h1>Saved Places</h1>
          <button className="add-list-btn">+ List</button>
        </div>

        {/* List tabs */}
        <div className="list-tabs">
          {LISTS.map(list => (
            <button
              key={list}
              className={`list-tab ${activeList === list ? 'active' : ''}`}
              onClick={() => setActiveList(list)}
            >
              {list}
              {list !== 'All' && (
                <span className="tab-count">
                  {listCounts[list] || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Saved list */}
        <div className="saved-list">
          {!token ? (
            <div className="saved-empty">
              <span>🔖</span>
              <p>Sign in to see your saved places</p>
              <button onClick={() => navigate('/login')}>Sign In</button>
            </div>
          ) : filteredSaved.length === 0 ? (
            <div className="saved-empty">
              <span>🔖</span>
              <p>No saved places here yet</p>
              <button onClick={() => navigate('/directory')}>Browse Directory</button>
            </div>
          ) : (
            filteredSaved.map(({ building, savedId, list, savedAt }) => (
              <button
                key={savedId || building.id}
                className="saved-item"
                onClick={() => navigate(`/directory/buildings/${building.id}`)}
              >
                <div
                  className="saved-item-icon"
                  style={{ background: categoryColors[building.category] + '22', borderColor: categoryColors[building.category] + '44' }}
                >
                  <span style={{ color: categoryColors[building.category] }}>
                    {categoryEmoji(building.category)}
                  </span>
                </div>
                <div className="saved-item-info">
                  <span className="saved-item-name">{building.name}</span>
                  <span className="saved-item-sub">
                    {building.category} · Saved {formatSavedAgo(savedAt)}
                  </span>
                </div>
                <button
                  className="saved-remove"
                  onClick={(e) => removeSaved(savedId, e)}
                  title="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </button>
              </button>
            ))
          )}
        </div>

        {filteredSaved.length > 0 && (
          <button className="browse-more" onClick={() => navigate('/directory')}>
            + Add more places
          </button>
        )}
      </div>
    </div>
  );
}

function categoryEmoji(cat) {
  const map = { Dining: '🍽', Study: '📚', Recreation: '🏋', Academic: '🏛', Outdoor: '🌳', Services: '🛎', Parking: '🅿' };
  return map[cat] || '📍';
}