import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // We can reuse App.css or create Home.css

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="toolbox-icon">🧰</div>
        <h1 className="business-title">Arnold Rich<br/>Business Tool</h1>
      </div>
      
      <div className="menu-grid">
        <Link to="/playlist" className="menu-item">
          <div className="icon-square music-icon">
            <div className="icon-bg">🎵</div>
            <span className="icon-text">무료 음악</span>
            <span className="icon-subtext">Free Music</span>
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
      </div>
    </div>
  );
};

export default Home;
