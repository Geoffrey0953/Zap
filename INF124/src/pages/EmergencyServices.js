import React from 'react';
import './EmergencyServices.css';

const CONTACTS = [
  { label: 'UCI Police (Emergency)', number: '911', type: 'emergency', icon: '🚨' },
  { label: 'UCI Police (Non-Emergency)', number: '(949) 824-5223', type: 'police', icon: '👮' },
  { label: 'Campus Health Center', number: '(949) 824-5301', type: 'health', icon: '🏥' },
  { label: 'Counseling Center', number: '(949) 824-6457', type: 'mental', icon: '🧠' },
  { label: 'Title IX / CARE Office', number: '(949) 824-7273', type: 'support', icon: '🤝' },
  { label: 'Student Health Insurance', number: '(949) 824-0770', type: 'health', icon: '💊' },
];

const RESOURCES = [
  { title: 'UCI Safe Ride', desc: 'Free late-night escort service Sun–Thu 8pm–1am', link: '#', icon: '🚗' },
  { title: 'Blue Light Phones', desc: '50+ emergency call stations across campus', link: '#', icon: '🔵' },
  { title: 'Crisis Text Line', desc: 'Text HOME to 741741 for 24/7 crisis support', link: '#', icon: '💬' },
  { title: 'National Suicide Hotline', desc: 'Call or text 988 anytime', link: '#', icon: '💙' },
];

export default function EmergencyServices() {
  return (
    <div className="emergency-page">
      <div className="emergency-container">

        <div className="emergency-header">
          <h1>Emergency Services</h1>
          <p>Campus safety resources and contacts</p>
        </div>

        {/* 911 banner */}
        <a href="tel:911" className="emergency-911">
          <span className="e911-icon">🚨</span>
          <div>
            <strong>In an emergency, call 911</strong>
            <p>Tap to call immediately</p>
          </div>
          <span className="e911-num">911</span>
        </a>

        {/* Contacts */}
        <div className="emergency-section">
          <h2>Emergency Contacts</h2>
          <div className="contacts-list">
            {CONTACTS.map(c => (
              <a key={c.label} href={`tel:${c.number.replace(/\D/g, '')}`} className={`contact-card type-${c.type}`}>
                <span className="contact-icon">{c.icon}</span>
                <div className="contact-info">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-number">{c.number}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="emergency-section">
          <h2>Safety Resources</h2>
          <div className="resources-list">
            {RESOURCES.map(r => (
              <div key={r.title} className="resource-card">
                <span className="resource-icon">{r.icon}</span>
                <div className="resource-info">
                  <span className="resource-title">{r.title}</span>
                  <span className="resource-desc">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus map note */}
        <div className="emergency-note">
          <span>📍</span>
          <p>Blue light emergency phones are located every 200ft across campus. Look for the blue-lit pillars.</p>
        </div>

      </div>
    </div>
  );
}
