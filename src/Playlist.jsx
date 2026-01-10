import { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import './App.css';

function Playlist() {
  const [playlist, setPlaylist] = useState([
    'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi Girl
    'https://www.youtube.com/watch?v=5yx6BWlEVcY', // Chillhop
  ]);
  const [currentUrl, setCurrentUrl] = useState(''); // User input
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  
  const playerRef = useRef(null);

  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    // If not looping and we reached the end, stop
    if (!isLooping && nextIndex === 0 && playlist.length > 1) {
      setPlaying(false);
      return;
    }
    setCurrentIndex(nextIndex);
    setPlaying(true);
  };

  const addUrl = () => {
    if (currentUrl.trim() !== '') {
      setPlaylist([...playlist, currentUrl]);
      setCurrentUrl('');
    }
  };

  const handleRemove = (e, index) => {
    e.stopPropagation(); // Prevent playing when clicking remove
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (currentIndex >= index && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="playlist-app">
      <header className="playlist-header">
        <h1>Music Playlist</h1>
        <div className="playlist-input-container">
          <input 
            type="text" 
            className="playlist-title-input"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
          />
          <button className="add-btn" onClick={addUrl}>Add</button>
        </div>
      </header>

      <div className="main-content">
        {/* Player Section */}
        <div className="player-card">
          <div className="player-wrapper">
            {playlist.length > 0 && (
              <ReactPlayer
                ref={playerRef}
                url={playlist[currentIndex]}
                playing={playing}
                controls={true}
                width="100%"
                height="100%"
                onEnded={handleEnded}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 }
                  }
                }}
              />
            )}
            {playlist.length === 0 && (
              <div className="empty-player">
                <p>Add songs to start playing</p>
              </div>
            )}
          </div>
          
          <div className="player-controls-bar">
             <button className="control-btn" onClick={() => setPlaying(!playing)}>
               {playing ? '⏸ Pause' : '▶ Play'}
             </button>
             <button 
               className={`control-btn ${isLooping ? 'active' : ''}`} 
               onClick={() => setIsLooping(!isLooping)}
             >
               🔁 Loop {isLooping ? 'On' : 'Off'}
             </button>
          </div>
        </div>

        {/* Playlist Items */}
        <div className="playlist-list">
          {playlist.map((url, idx) => (
            <div 
              key={idx} 
              className={`playlist-item ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                setPlaying(true);
              }}
            >
              <span className="item-number">{idx + 1}</span>
              <div className="item-info">
                <span className="item-url">{url}</span>
                {idx === currentIndex && <span className="playing-badge">Now Playing</span>}
              </div>
              <button className="remove-btn" onClick={(e) => handleRemove(e, idx)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Playlist;
