import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header fade-in">
      <div className="container">
        <h1>🚌 Transport Tracker</h1>
        <p>Real-time bus tracking for your city</p>
        
        {/* Navigation Links */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🗺️ Live Map
          </Link>
          <Link 
            to="/driver" 
            className={`nav-link ${location.pathname === '/driver' ? 'active' : ''}`}
          >
            🚗 Driver App
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            🛡️ Admin Panel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;