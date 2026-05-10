import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDINGS, DEPARTMENTS } from '../data/mockData';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search places, buildings, food...', autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const buildings = BUILDINGS
      .filter(b => b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
      .slice(0, 4)
      .map(b => ({ ...b, type: 'building' }));
    const depts = DEPARTMENTS
      .filter(d => d.name.toLowerCase().includes(q))
      .slice(0, 2)
      .map(d => ({ ...d, type: 'department' }));
    setResults([...buildings, ...depts]);
  }, [query]);

  const handleSelect = (item) => {
    if (item.type === 'building') navigate(`/directory/buildings/${item.id}`);
    else navigate(`/directory/departments`);
    setQuery('');
    setResults([]);
    setFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0]);
  };

  return (
    <div className={`search-bar-wrapper ${focused ? 'focused' : ''}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => { setQuery(''); setResults([]); }}>✕</button>
        )}
      </form>

      {focused && results.length > 0 && (
        <div className="search-dropdown">
          {results.map(item => (
            <button key={`${item.type}-${item.id}`} className="search-result-item" onMouseDown={() => handleSelect(item)}>
              <span className="result-icon">{item.type === 'building' ? '🏛' : '📚'}</span>
              <div className="result-info">
                <span className="result-name">{item.name}</span>
                <span className="result-sub">{item.type === 'building' ? item.category : item.school}</span>
              </div>
              <span className="result-tag">{item.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
