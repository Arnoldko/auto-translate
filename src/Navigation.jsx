import React from 'react';
import { NavLink } from 'react-router-dom';
import './App.css';

function Navigation({ toggleTheme, isDarkMode }) {
  return (
    <nav className="side-nav">
      <div className="nav-items">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="홈">
          🏠
        </NavLink>
        <NavLink to="/playlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="재생 목록">
          🎵
        </NavLink>
        <NavLink to="/translator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="번역기">
          🌐
        </NavLink>
        <NavLink to="/tools/currency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="환율 계산기">
          💰
        </NavLink>
      </div>
      
      <button className="theme-toggle-btn" onClick={toggleTheme} title="테마 변경">
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}

export default Navigation;
