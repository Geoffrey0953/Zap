import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDINGS } from '../data/mockData';
import './SavedLocations.css';

const SAVED_MOCK = [
  { id: 'library', savedAgo: '2d ago', list: 'Study' },
  { id: 'arc', savedAgo: '5d ago', list: 'Food' },
  { id: 'mesa', savedAgo: '1w ago', list: 'Food' },
  { id: 'aldrich', savedAgo: '2w ago', list: 'Outdoor' },
];

const LISTS = ['All', 'Study', 'Food', 'Outdoor'];

const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};

export default function SavedLocations() {
  const [activeList, setActiveList] = useState('All');
  const navigate = useNavigate();

  const savedBuildings = SAVED_MOCK
    .filter(s => activeList === 'All' || s.list === activeList)
    .map(s => ({
      ...s,
      building: BUILDINGS.find(b => b.id === s.id),
    }))
    .filter(s => s.building);

  const removeSaved = (id, e) => {
    e.stopPropagation();
    alert(`Remove ${id} (wire up with real state later)`);
  };

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
                  {SAVED_MOCK.filter(s => s.list === list).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Saved list */}
        <div className="saved-list">
          {savedBuildings.length === 0 ? (
            <div className="saved-empty">
              <span>🔖</span>
              <p>No saved places here yet</p>
              <button onClick={() => navigate('/directory')}>Browse Directory</button>
            </div>
          ) : (
            savedBuildings.map(({ building, savedAgo, list }) => (
              <button
                key={building.id}
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
                    {building.category} · Saved {savedAgo}
                  </span>
                </div>
                <button
                  className="saved-remove"
                  onClick={(e) => removeSaved(building.id, e)}
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

        {savedBuildings.length > 0 && (
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
