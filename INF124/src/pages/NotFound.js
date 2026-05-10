import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1>Page not found</h1>
        <p>Looks like this spot doesn't exist on the ZAP map yet.</p>
        <div className="notfound-btns">
          <button className="nf-btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/" className="nf-btn-ghost">Home</Link>
          <Link to="/map" className="nf-btn-ghost">Open Map</Link>
        </div>
      </div>
    </div>
  );
}
