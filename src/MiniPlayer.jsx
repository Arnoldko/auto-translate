import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './MiniPlayer.css';

const MiniPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk'); // Default lofi
  const [playing, setPlaying] = useState(false);

  const togglePlayer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`mini-player-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="player-toggle" onClick={togglePlayer}>
        {isOpen ? '❌' : '🎵'}
      </div>
      
      <div className="player-content">
        <div className="player-wrapper">
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            playing={playing}
            controls={true}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={(e) => console.log('Player Error:', e)}
            config={{
              youtube: {
                playerVars: { showinfo: 0 }
              }
            }}
          />
        </div>
        <div className="player-controls">
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="YouTube URL..." 
            className="player-input"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
