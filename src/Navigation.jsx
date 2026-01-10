import React from 'react';
import { NavLink } from 'react-router-dom';
import './App.css';

function Navigation({ toggleTheme, isDarkMode }) {
  return (
    <nav className="side-nav">
      <div className="nav-items">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Home">
          🏠
        </NavLink>
        <NavLink to="/playlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Playlist">
          🎵
        </NavLink>
        <NavLink to="/translator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Translator">
          🌐
        </NavLink>
        <NavLink to="/exchange" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Exchange Rates">
          💰
        </NavLink>
      </div>
      
      <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}

export default Navigation;
