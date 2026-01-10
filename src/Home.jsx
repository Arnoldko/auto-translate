import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdSenseBanner from './AdSenseBanner';
import './App.css'; // We can reuse App.css or create Home.css

const Home = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="home-container">
      <div className="home-header">
        {!imgError ? (
          <img 
            src="/logo.svg" 
            alt="로고" 
            className="main-logo" 
            onError={() => setImgError(true)} 
          />
        ) : (
          <div className="toolbox-icon">🧰</div>
        )}
        <h1 className="business-title">통합 스마트 비즈니스 인텔리전스 & 자동화 플랫폼</h1>
        <div className="business-subtitle">글로벌 전략 파트너</div>
      </div>
      
      <div className="menu-grid">
        <Link to="/music" className="menu-item">
          <div className="icon-square music-icon">
            <div className="icon-bg">🎵</div>
            <span className="icon-text">음악 채널</span>
            <span className="icon-subtext">유튜브 뮤직</span>
          </div>
        </Link>
        <Link to="/translator" className="menu-item">
          <div className="icon-square translator-icon">
            <div className="icon-bg">🌐</div>
            <span className="icon-text">동시 통역</span>
            <span className="icon-subtext">번역기</span>
          </div>
        </Link>
        <Link to="/tools/currency" className="menu-item">
          <div className="icon-square exchange-icon">
            <div className="icon-bg">💱</div>
            <span className="icon-text">환율 계산</span>
            <span className="icon-subtext">실시간 환율</span>
          </div>
        </Link>
        <Link to="/flights" className="menu-item">
          <div className="icon-square flight-icon">
            <div className="icon-bg">✈️</div>
            <span className="icon-text">최저가 항공</span>
            <span className="icon-subtext">항공권 검색</span>
          </div>
        </Link>
        <Link to="/tools/qr" className="menu-item">
          <div className="icon-square qr-icon">
            <div className="icon-bg">📱</div>
            <span className="icon-text">QR 코드</span>
            <span className="icon-subtext">QR 생성기</span>
          </div>
        </Link>
        <Link to="/tools/unit" className="menu-item">
          <div className="icon-square unit-icon">
            <div className="icon-bg">⚖️</div>
            <span className="icon-text">단위 변환</span>
            <span className="icon-subtext">단위 계산기</span>
          </div>
        </Link>
        <Link to="/tools/text" className="menu-item">
          <div className="icon-square text-icon">
            <div className="icon-bg">📝</div>
            <span className="icon-text">텍스트 도구</span>
            <span className="icon-subtext">글자수/변환</span>
          </div>
        </Link>
        <Link to="/tools/crypto" className="menu-item">
          <div className="icon-square crypto-icon">
            <div className="icon-bg">🪙</div>
            <span className="icon-text">암호화폐 시세</span>
            <span className="icon-subtext">코인 트래커</span>
          </div>
        </Link>
        <Link to="/tools/image" className="menu-item">
          <div className="icon-square image-icon">
            <div className="icon-bg">📸</div>
            <span className="icon-text">이미지 검색</span>
            <span className="icon-subtext">구글 렌즈 검색</span>
          </div>
        </Link>
        <Link to="/tools/json" className="menu-item">
          <div className="icon-square json-icon">
            <div className="icon-bg">📋</div>
            <span className="icon-text">JSON 도구</span>
            <span className="icon-subtext">포맷터/검사</span>
          </div>
        </Link>
      </div>
      
      {/* AdSense Banner Example */}
      <AdSenseBanner slotId="1234567890" />
    </div>
  );
};

export default Home;
