import React, { useState } from 'react';
import './HelpCenter.css';

const FAQS = [
  { q: 'How do I save a location?', a: 'Sign in to your account, navigate to any building detail page, and tap the "Save" button in the top right corner.' },
  { q: 'Can I use ZAP without signing in?', a: 'Yes! You can browse the map, directory, and campus places as a guest. Sign in to access saved locations, class schedule, and personalized features.' },
  { q: 'How do I report incorrect building information?', a: 'Use the "Report an Issue" form below and select "Incorrect Information" as the category. Our team reviews all submissions.' },
  { q: 'Is ZAP available as a mobile app?', a: 'ZAP is a Progressive Web App (PWA). On mobile, you can add it to your home screen for an app-like experience.' },
];

const CATEGORIES = ['General Question', 'Incorrect Information', 'Missing Location', 'Technical Issue', 'Other'];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ category: '', subject: '', message: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="help-page">
      <div className="help-container">

        <div className="help-header">
          <h1>Help / Report Center</h1>
          <p>Find answers or send us a report</p>
        </div>

        {/* Quick links */}
        <div className="help-quick">
          {QUICK_HELP.map(item => (
            <a key={item.label} href={item.href} className="help-quick-card">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report form */}
        <div className="report-section">
          <h2>Submit a Report</h2>
          {submitted ? (
            <div className="report-success">
              <span>✅</span>
              <h3>Report submitted!</h3>
              <p>Thanks for helping improve ZAP. We'll review your submission shortly.</p>
              <button onClick={() => { setSubmitted(false); setForm({ category: '', subject: '', message: '', email: '' }); }}>
                Submit another
              </button>
            </div>
          ) : (
            <form className="report-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Brief description" required />
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe the issue in detail..." rows={4} required />
              </div>
              <div className="input-group">
                <label>Your Email (optional)</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="For follow-up" />
              </div>
              <button type="submit" className="report-submit">Submit Report</button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

const QUICK_HELP = [
  { icon: '📧', label: 'Email Support', href: 'mailto:zap-support@uci.edu' },
  { icon: '🐛', label: 'Report a Bug', href: '#report' },
  { icon: '📋', label: 'Feedback', href: '#report' },
];
