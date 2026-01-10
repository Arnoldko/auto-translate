import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function Playlist() {
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [urls, setUrls] = useState(['', '', '', '', '']);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackHistory, setPlaybackHistory] = useState([]);
  const [playerError, setPlayerError] = useState(null);
  
  // Ref for the player
  const playerRef = useRef(null);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const startPlaylist = () => {
    setPlayerError(null);
    // Find first non-empty URL
    const firstIndex = urls.findIndex(url => url.trim() !== '');
    if (firstIndex !== -1) {
      setCurrentUrlIndex(firstIndex);
      setIsPlaying(true);
    } else {
      alert('Please enter at least one YouTube URL.');
    }
  };

  const handleEnded = () => {
    const nextIndex = urls.findIndex((url, i) => i > currentUrlIndex && url.trim() !== '');
    
    if (nextIndex !== -1) {
      // Play next song
      setCurrentUrlIndex(nextIndex);
      setIsPlaying(true); // Ensure it keeps playing
    } else {
      // End of playlist
      if (isLooping) {
        // Loop back to start
        startPlaylist();
      } else {
        setIsPlaying(false);
        setCurrentUrlIndex(-1); // Reset or keep last? Let's reset for now or just stop.
      }
    }
  };

  const handlePlaySpecific = (index) => {
    if (urls[index].trim() !== '') {
      setPlayerError(null);
      setCurrentUrlIndex(index);
      setIsPlaying(true);
    }
  };

  const handleError = (e) => {
    console.error("Player Error:", e);
    setPlayerError("동영상을 재생할 수 없습니다.");
  };

  // Helper to extract video ID for thumbnail (optional enhancement)
  const getThumbnail = (url) => {
    // Simple regex for youtube ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
      : null;
  };

  return (
    <div className="playlist-app">
      <header className="playlist-header">
        <input 
          type="text" 
          className="playlist-title-input"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter Playlist Name"
        />
        <div className="header-controls">
           <span className="premium-badge">Basic Plan (5 Songs)</span>
        </div>
      </header>

      <div className="main-content">
        {/* Player Section */}
        <div className={`player-container ${currentUrlIndex !== -1 ? 'active' : ''}`}>
          {currentUrlIndex !== -1 ? (
            <div className="player-wrapper">
              {playerError && (
                <div className="player-error-overlay">
                  <p>{playerError}</p>
                </div>
              )}
              <ReactPlayer
                /* key={urls[currentUrlIndex]} Removed to prevent crash loop */
                className="react-player"
                ref={playerRef}
                url={urls[currentUrlIndex]}
                playing={isPlaying}
                controls={true}
                volume={1}
                muted={false}
                width="100%"
                height="100%"
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={handleError}
                // youtube config for playsinline (helps with mobile background/screen off to some extent)
                config={{
                  youtube: {
                    playerVars: { 
                      playsinline: 1,
                      showinfo: 0,
                      rel: 0,
                      origin: window.location.origin 
                    }
                  }
                }}
              />
              <div className="now-playing-info">
                <h3>Now Playing: Track {currentUrlIndex + 1}</h3>
              </div>
            </div>
          ) : (
            <div className="player-placeholder">
              <div className="placeholder-content">
                <span className="icon">🎵</span>
                <p>Add URLs and press Play to start</p>
              </div>
            </div>
          )}
        </div>

        {/* Playlist Input Section */}
        <div className="playlist-controls">
          <div className="url-list">
            {urls.map((url, index) => (
              <div 
                key={index} 
                className={`url-input-group ${currentUrlIndex === index ? 'playing' : ''}`}
              >
                <span className="track-number">{index + 1}</span>
                <input
                  type="text"
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {url && (
                  <button 
                    className="play-track-btn"
                    onClick={() => handlePlaySpecific(index)}
                  >
                    ▶
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="start-btn" onClick={startPlaylist}>
              {isPlaying && currentUrlIndex !== -1 ? 'Restart Playlist' : 'Start Playlist'}
            </button>
            <div className="loop-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={isLooping} 
                  onChange={(e) => setIsLooping(e.target.checked)} 
                />
                Loop Playlist
              </label>
            </div>
          </div>
          
          <div className="premium-hint">
             <p>Want more than 5 songs? <a href="#" onClick={(e) => e.preventDefault()}>Upgrade to Premium</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
