import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Playlist from './Playlist';
import Translator from './Translator';
import Flights from './Flights';
import Music from './Music';
import QRCodeGenerator from './tools/QRCodeGenerator';
import UnitConverter from './tools/UnitConverter';
import TextTools from './tools/TextTools';
import CryptoTracker from './tools/CryptoTracker';
import ImageSearch from './tools/ImageSearch';
import JsonFormatter from './tools/JsonFormatter';
import CurrencyConverter from './tools/CurrencyConverter';
import Navigation from './Navigation';
import AdSenseBanner from './AdSenseBanner';
import './App.css';

function App() {
  return (
    <Router>
      <div className="cyber-bg-container">
        <div className="cyber-grid"></div>
        <div className="cyber-glow"></div>
        <div className="cyber-scanline"></div>
      </div>
      
      <Navigation />
      
      <div className="main-layout">
        {/* Left Sidebar Ad */}
        <aside className="ad-sidebar left-sidebar">
          <div className="ad-sticky">
            <AdSenseBanner 
              slotId="1234567890" 
              style={{ minHeight: '600px', width: '160px' }} 
              format="vertical"
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/music" element={<Music />} />
            <Route path="/tools/qr" element={<QRCodeGenerator />} />
            <Route path="/tools/unit" element={<UnitConverter />} />
            <Route path="/tools/text" element={<TextTools />} />
            <Route path="/tools/crypto" element={<CryptoTracker />} />
            <Route path="/tools/image" element={<ImageSearch />} />
            <Route path="/tools/json" element={<JsonFormatter />} />
            <Route path="/tools/currency" element={<CurrencyConverter />} />
          </Routes>
          
          {/* Bottom Ad (Footer) */}
          <footer className="ad-footer">
            <AdSenseBanner 
              slotId="1234567890" 
              style={{ minHeight: '90px', width: '100%' }} 
              format="horizontal"
            />
          </footer>
        </main>

        {/* Right Sidebar Ad */}
        <aside className="ad-sidebar right-sidebar">
          <div className="ad-sticky">
            <AdSenseBanner 
              slotId="1234567890" 
              style={{ minHeight: '600px', width: '160px' }} 
              format="vertical"
            />
          </div>
        </aside>
      </div>
    </Router>
  );
}

export default App;
