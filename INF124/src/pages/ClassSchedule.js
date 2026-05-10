import React, { useState } from 'react';
import './ClassSchedule.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const MOCK_SCHEDULE = [
  { id: 1, code: 'INF 124', name: 'Web & Mobile Systems', instructor: 'Prof. Amir', location: 'DBH 1500', days: ['Mon', 'Wed'], start: '9:00 AM', end: '10:20 AM', color: '#4ecda4' },
  { id: 2, code: 'INF 131', name: 'Human-Computer Interaction', instructor: 'Prof. Stacy', location: 'ICS 174', days: ['Tue', 'Thu'], start: '11:00 AM', end: '12:20 PM', color: '#5b9cf6' },
  { id: 3, code: 'STATS 67', name: 'Intro to Probability and Statistics', instructor: 'Prof. Kim', location: 'PSLH 100', days: ['Mon', 'Wed', 'Fri'], start: '1:00 PM', end: '1:50 PM', color: '#f5c842' },
  { id: 4, code: 'WRITING 39C', name: 'Argument and Research', instructor: 'Prof. Lopez', location: 'HH 116', days: ['Tue'], start: '2:00 PM', end: '4:50 PM', color: '#c084fc' },
];

export default function ClassSchedule() {
  const [activeDay, setActiveDay] = useState('Mon');
  const [view, setView] = useState('week'); // 'week' | 'list'

  const todaysClasses = MOCK_SCHEDULE.filter(c => c.days.includes(activeDay));

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

        {view === 'week' ? (
          <>
            {/* Day selector */}
            <div className="day-selector">
              {DAYS.map(day => (
                <button
                  key={day}
                  className={`day-btn ${activeDay === day ? 'active' : ''}`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                  {MOCK_SCHEDULE.some(c => c.days.includes(day)) && (
                    <span className="day-dot" />
                  )}
                </button>
              ))}
            </div>

            {/* Day classes */}
            <div className="day-classes">
              {todaysClasses.length === 0 ? (
                <div className="no-class">
                  <span>🎉</span>
                  <p>No classes on {activeDay}!</p>
                </div>
              ) : (
                todaysClasses.map(cls => (
                  <ClassCard key={cls.id} cls={cls} />
                ))
              )}
            </div>
          </>
        ) : (
          /* List view — all classes */
          <div className="list-view">
            {MOCK_SCHEDULE.map(cls => (
              <ClassCard key={cls.id} cls={cls} showDays />
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="schedule-summary">
          <div className="summary-stat">
            <span className="ss-num">{MOCK_SCHEDULE.length}</span>
            <span className="ss-label">Courses</span>
          </div>
          <div className="summary-stat">
            <span className="ss-num">{MOCK_SCHEDULE.reduce((a, c) => a + c.days.length, 0)}</span>
            <span className="ss-label">Sessions / week</span>
          </div>
          <div className="summary-stat">
            <span className="ss-num">14</span>
            <span className="ss-label">Units</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function ClassCard({ cls, showDays = false }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="class-card" style={{ borderLeftColor: cls.color }}>
      <div className="class-card-main" onClick={() => setExpanded(e => !e)}>
        <div className="class-time-col">
          <span className="class-time-start">{cls.start}</span>
          <span className="class-time-end">{cls.end}</span>
        </div>
        <div className="class-info">
          <div className="class-top">
            <span className="class-code" style={{ color: cls.color }}>{cls.code}</span>
            {showDays && (
              <div className="class-days">
                {cls.days.map(d => <span key={d} className="class-day-tag">{d}</span>)}
              </div>
            )}
          </div>
          <span className="class-name">{cls.name}</span>
          <span className="class-meta">{cls.instructor}</span>
        </div>
        <span className="class-expand">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="class-expanded">
          <div className="class-detail-row">
            <span>📍</span>
            <span>{cls.location}</span>
          </div>
          <div className="class-detail-row">
            <span>👤</span>
            <span>{cls.instructor}</span>
          </div>
          <div className="class-detail-row">
            <span>📅</span>
            <span>{cls.days.join(', ')} · {cls.start} – {cls.end}</span>
          </div>
          <button className="get-directions-cls">
            🧭 Get directions to {cls.location}
          </button>
        </div>
      )}
    </div>
  );
}
