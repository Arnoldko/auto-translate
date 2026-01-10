import React from 'react';
import { Link } from 'react-router-dom';
import AdSenseBanner from './AdSenseBanner';
import './App.css'; // We can reuse App.css or create Home.css

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="toolbox-icon">🧰</div>
        <h1 className="business-title">Arnold Rich<br/>Business Tool</h1>
        <div className="business-subtitle">Global Smart Assistant</div>
      </div>
      
      <div className="menu-grid">
        <Link to="/music" className="menu-item">
          <div className="icon-square music-icon">
            <div className="icon-bg">🎵</div>
            <span className="icon-text">음악 채널</span>
            <span className="icon-subtext">YouTube Music</span>
          </div>
        </Link>
        <Link to="/translator" className="menu-item">
          <div className="icon-square translator-icon">
            <div className="icon-bg">🌐</div>
            <span className="icon-text">동시 통역</span>
            <span className="icon-subtext">Translator</span>
          </div>
        </Link>
        <Link to="/exchange" className="menu-item">
          <div className="icon-square exchange-icon">
            <div className="icon-bg">💱</div>
            <span className="icon-text">환율 계산</span>
            <span className="icon-subtext">Exchange</span>
          </div>
        </Link>
        <Link to="/flights" className="menu-item">
          <div className="icon-square flight-icon">
            <div className="icon-bg">✈️</div>
            <span className="icon-text">최저가 항공</span>
            <span className="icon-subtext">Cheap Flights</span>
          </div>
        </Link>
      </div>
      
      {/* AdSense Banner Example */}
      <AdSenseBanner slotId="1234567890" />
    </div>
  );
};

export default Home;
