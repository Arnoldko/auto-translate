import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // We can reuse App.css or create Home.css

const Home = () => {
  return (
    <div className="home-container">
      <div className="menu-grid">
        <Link to="/playlist" className="menu-item">
          <div className="icon-square music-icon">
            <span className="icon-text">무료음악듣기</span>
          </div>
        </Link>
        <Link to="/translator" className="menu-item">
          <div className="icon-square translator-icon">
            <span className="icon-text">동시통역</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
