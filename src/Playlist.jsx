import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function Playlist() {
  const [playlistName, setPlaylistName] = useState('My Playlist');
  // Pre-fill the first slot with the user's requested URL for demonstration
  const [urls, setUrls] = useState([
    'https://youtu.be/UW6fyT7oVrA?list=RDUW6fyT7oVrA', 
    '', 
    '', 
    '', 
    ''
  ]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackHistory, setPlaybackHistory] = useState([]);
  const [playerError, setPlayerError] = useState(null);
  
  // Ref for the player
  const playerRef = useRef(null);

  const logToDebug = (msg) => {
    console.log(msg);
  };

  const handleUrlChange = (index, value) => {
    console.log(`[Input] URL changed at index ${index}:`, value);
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Helper to normalize YouTube URL
  const getPlayableUrl = (url) => {
    if (!url) return url;
    try {
      let videoId = null;
      
      // Handle short url (youtu.be)
      if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } 
      // Handle standard url (youtube.com)
      else if (url.includes('youtube.com/watch')) {
        try {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v');
        } catch (e) {
          // Fallback regex if URL parsing fails
          const match = url.match(/[?&]v=([^&]+)/);
          if (match) videoId = match[1];
        }
      }

      if (videoId) {
          const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
          // console.log('[Debug] Converted URL:', newUrl);
          return newUrl;
      }
      return url;
    } catch (e) {
      console.error('[Debug] URL Conversion Error:', e);
      return url;
    }
  };

  const startPlaylist = () => {
    console.log('[Action] Start Playlist clicked');
    setPlayerError(null);
    // Find first non-empty URL
    const firstIndex = urls.findIndex(url => url.trim() !== '');
    console.log('[Debug] First valid URL index:', firstIndex);
    
    if (firstIndex !== -1) {
      setCurrentUrlIndex(firstIndex);
      setIsPlaying(true);
      console.log('[State] Setting playing to true for index:', firstIndex);
    } else {
      alert('Please enter at least one YouTube URL.');
    }
  };

  const handleEnded = () => {
    console.log('[Event] Song ended');
    const nextIndex = urls.findIndex((url, i) => i > currentUrlIndex && url.trim() !== '');
    
    if (nextIndex !== -1) {
      // Play next song
      setCurrentUrlIndex(nextIndex);
      setIsPlaying(true); // Ensure it keeps playing
      console.log('[Action] Playing next song at index:', nextIndex);
    } else {
      // End of playlist
      if (isLooping) {
        // Loop back to start
        console.log('[Action] Looping back to start');
        startPlaylist();
      } else {
        console.log('[Action] Playlist finished');
        setIsPlaying(false);
        setCurrentUrlIndex(-1); // Reset or keep last? Let's reset for now or just stop.
      }
    }
  };

  const handlePlaySpecific = (index) => {
    console.log(`[Action] Play specific clicked for index ${index}`);
    if (urls[index].trim() !== '') {
      setPlayerError(null);
      setCurrentUrlIndex(index);
      setIsPlaying(true);
      console.log('[State] Setting playing to true');
    } else {
        console.log('[Warn] Url is empty');
    }
  };

  const handleError = (e) => {
    console.error("Player Error Event:", e);
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
          {/* Keep player mounted but hidden when inactive to improve autoplay reliability */}
          <div className="player-wrapper" style={{ 
            display: 'block',
            visibility: currentUrlIndex !== -1 ? 'visible' : 'hidden',
            position: currentUrlIndex !== -1 ? 'relative' : 'absolute',
            zIndex: currentUrlIndex !== -1 ? 1 : -1,
            opacity: currentUrlIndex !== -1 ? 1 : 0,
            height: currentUrlIndex !== -1 ? 'auto' : 0,
            paddingTop: currentUrlIndex !== -1 ? '56.25%' : 0
          }}>
            {playerError && (
              <div className="player-error-overlay">
                <p>{playerError}</p>
              </div>
            )}
            <ReactPlayer
              className="react-player"
              ref={playerRef}
              url={currentUrlIndex !== -1 ? getPlayableUrl(urls[currentUrlIndex]) : getPlayableUrl(urls.find(u => u.trim() !== ''))}
              playing={isPlaying}
              controls={true}
              volume={1}
              muted={false}
              width="100%"
              height="100%"
              onEnded={handleEnded}
              onPlay={() => {
                setIsPlaying(true);
                logToDebug('[Event] Player onPlay');
              }}
              onPause={() => {
                setIsPlaying(false);
                logToDebug('[Event] Player onPause');
              }}
              onError={handleError}
              onReady={() => logToDebug('[Event] Player Ready')}
              onStart={() => logToDebug('[Event] Player Started')}
              onBuffer={() => logToDebug('[Event] Player Buffering')}
              config={{
                youtube: {
                  playerVars: { 
                    playsinline: 1,
                    showinfo: 0,
                    rel: 0,
                    // origin: window.location.origin, // Removed origin as it can cause CORS issues with some videos
                    autoplay: 1
                  }
                }
              }}
            />
            {currentUrlIndex !== -1 && (
                <div className="now-playing-info">
                    <h3>Now Playing: Track {currentUrlIndex + 1}</h3>
                </div>
            )}
          </div>
          
          {currentUrlIndex === -1 && (
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
