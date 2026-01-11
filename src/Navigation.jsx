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
        <NavLink to="/music" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="음악 채널">
          🎵
        </NavLink>
        <NavLink to="/translator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="번역기">
          🌐
        </NavLink>
        <NavLink to="/tools/currency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="환율 계산기">
          💱
        </NavLink>
        <NavLink to="/flights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="항공권 검색">
          ✈️
        </NavLink>
        <NavLink to="/tools/qr" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="QR 생성기">
          📱
        </NavLink>
        <NavLink to="/tools/unit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="단위 변환기">
          ⚖️
        </NavLink>
        <NavLink to="/tools/text" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="텍스트 도구">
          📝
        </NavLink>
        <NavLink to="/tools/crypto" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="코인 시세">
          🪙
        </NavLink>
        <NavLink to="/tools/image" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="이미지 검색">
          📸
        </NavLink>
        <NavLink to="/tools/json" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="JSON 도구">
          📋
        </NavLink>
      </div>
      
      <button className="theme-toggle-btn" onClick={toggleTheme} title="테마 변경">
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}

export default Navigation;
