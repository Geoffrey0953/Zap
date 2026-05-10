import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function SignUp() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">◎</div>
          <span className="auth-logo-text">ZAP</span>
        </div>
        <p className="auth-tagline">Sign up</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" type="text" placeholder="First name" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" type="text" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="confirm">Re-type Password</label>
            <input id="confirm" name="confirm" type="password" placeholder="Re-type Password" value={form.confirm} onChange={handleChange} required />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create an account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
