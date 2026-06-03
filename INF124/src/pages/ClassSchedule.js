import React, { useState } from 'react';
import './ClassSchedule.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function ClassSchedule() {
  const [activeDay, setActiveDay] = useState('Mon');
  const [view, setView] = useState('week');

  return (
    <div className="schedule-page">
      <div className="schedule-container">

        <div className="schedule-header">
          <div>
            <h1>Class Schedule</h1>
            <p className="schedule-term">Spring 2026 · UCI</p>
          </div>
          <div className="view-toggle">
            <button className={`vtbtn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Week</button>
            <button className={`vtbtn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          </div>
        </div>

        {/* Day selector */}
        <div className="day-selector">
          {DAYS.map(day => (
            <button
              key={day}
              className={`day-btn ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="day-classes">
          <div className="no-class">
            <span>📅</span>
            <p>No classes added yet</p>
            <p className="no-class-hint">Class schedule coming soon. Check back later for your weekly courses.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="schedule-summary">
          <div className="summary-stat">
            <span className="ss-num">0</span>
            <span className="ss-label">Courses</span>
          </div>
          <div className="summary-stat">
            <span className="ss-num">0</span>
            <span className="ss-label">Sessions / week</span>
          </div>
          <div className="summary-stat">
            <span className="ss-num">0</span>
            <span className="ss-label">Units</span>
          </div>
        </div>

      </div>
    </div>
  );
}