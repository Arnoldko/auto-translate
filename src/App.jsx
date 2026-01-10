import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Playlist from './Playlist';
import Translator from './Translator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="cyber-bg-container">
        <div className="cyber-grid"></div>
        <div className="cyber-glow"></div>
        <div className="cyber-scanline"></div>
      </div>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/translator" element={<Translator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
