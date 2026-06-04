import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDINGS } from '../data/mockData';
import { getSavedLocations, toggleSavedLocation, timeAgo } from '../utils/savedLocations';
import './SavedLocations.css';
 
const LISTS = ['All', 'Study', 'Food', 'Recreation', 'Academic', 'Outdoor'];
 
const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};
 
function categoryEmoji(cat) {
  const map = { Dining: '🍽', Study: '📚', Recreation: '🏋', Academic: '🏛', Outdoor: '🌳', Services: '🛎', Parking: '🅿' };
  return map[cat] || '📍';
}
 
export default function SavedLocations() {
  const [activeList, setActiveList] = useState('All');
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    const load = () => setSavedItems(getSavedLocations());
    load();
    // Reload whenever user navigates back to this tab
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);
 
  const handleRemove = (buildingId, e) => {
    e.stopPropagation();
    const updated = toggleSavedLocation(buildingId);
    setSavedItems(updated);
  };
 
  const countForList = (list) => savedItems.filter(s => s.list === list).length;
 
  const visibleItems = savedItems
    .filter(s => activeList === 'All' || s.list === activeList)
    .map(s => ({ ...s, building: BUILDINGS.find(b => b.id === s.id) }))
    .filter(s => s.building);
 
  return (
    <div className="saved-page">
      <div className="saved-container">
        <div className="saved-header">
          <div>
            <h1>Saved Places</h1>
            <p className="saved-count">{savedItems.length} saved location{savedItems.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="browse-btn" onClick={() => navigate('/directory')}>+ Add Places</button>
        </div>
 
        {savedItems.length === 0 ? (
          <div className="saved-empty-full">
            <span>🔖</span>
            <h3>No saved places yet</h3>
            <p>Visit any building page and tap Save to bookmark it here.</p>
            <button onClick={() => navigate('/directory')}>Browse Directory</button>
            <button className="secondary" onClick={() => navigate('/map')}>Open Map</button>
          </div>
        ) : (
          <>
            <div className="list-tabs">
              <button className={`list-tab ${activeList === 'All' ? 'active' : ''}`} onClick={() => setActiveList('All')}>
                All <span className="tab-count">{savedItems.length}</span>
              </button>
              {LISTS.filter(l => l !== 'All' && countForList(l) > 0).map(list => (
                <button key={list} className={`list-tab ${activeList === list ? 'active' : ''}`} onClick={() => setActiveList(list)}>
                  {list} <span className="tab-count">{countForList(list)}</span>
                </button>
              ))}
            </div>
 
            <div className="saved-list">
              {visibleItems.length === 0 ? (
                <div className="saved-empty">
                  <span>🔖</span>
                  <p>No {activeList} places saved</p>
                  <button onClick={() => navigate('/directory')}>Browse Directory</button>
                </div>
              ) : (
                visibleItems.map(({ building, savedAt }) => (
                  <button key={building.id} className="saved-item" onClick={() => navigate(`/directory/buildings/${building.id}`)}>
                    <div className="saved-item-icon" style={{ background: (categoryColors[building.category] || categoryColors.default) + '22', borderColor: (categoryColors[building.category] || categoryColors.default) + '44' }}>
                      <span style={{ color: categoryColors[building.category] || categoryColors.default }}>{categoryEmoji(building.category)}</span>
                    </div>
                    <div className="saved-item-info">
                      <span className="saved-item-name">{building.name}</span>
                      <span className="saved-item-sub">{building.category} · Saved {timeAgo(savedAt)}</span>
                    </div>
                    <button className="saved-remove" onClick={(e) => handleRemove(building.id, e)} title="Remove from saved">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                    </button>
                  </button>
                ))
              )}
            </div>
            <button className="browse-more" onClick={() => navigate('/directory')}>+ Add more places</button>
          </>
        )}
      </div>
    </div>
  );
}