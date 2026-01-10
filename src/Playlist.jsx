import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './App.css';
import './tools/Tools.css';

function Playlist() {
  const [playlist, setPlaylist] = useState([
    'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'https://www.youtube.com/watch?v=5yx6BWlEVcY',
  ]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const playerRef = useRef(null);

  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    if (!isLooping && nextIndex === 0) {
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
    e.stopPropagation();
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (currentIndex >= index && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="playlist-app">
      <header className="playlist-header">
        <Link to="/" className="back-link">← 홈으로 돌아가기</Link>
        <h1>음악 플레이리스트 <span className="feature-icon-right">🎵</span></h1>
        <div className="playlist-input-container">
          <input
            type="text"
            className="playlist-title-input"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="유튜브 URL을 여기에 붙여넣으세요..."
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
          />
          <button className="add-btn" onClick={addUrl}>추가</button>
        </div>
      </header>

      <div className="main-content">
        <div className="player-card">
          <div className="player-wrapper">
            {playlist.length > 0 && (
              <ReactPlayer
                ref={playerRef}
                url={playlist[currentIndex]}
                playing={playing}
                controls
                width="100%"
                height="360px"
                onEnded={handleEnded}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            )}
            {playlist.length === 0 && (
              <div className="empty-player">
                <p>노래를 추가하여 재생을 시작하세요</p>
              </div>
            )}
          </div>

          <div className="player-controls-bar">
            <button className="control-btn" onClick={() => setPlaying(!playing)}>
              {playing ? '⏸ 일시정지' : '▶ 재생'}
            </button>
            <button
              className={`control-btn ${isLooping ? 'active' : ''}`}
              onClick={() => setIsLooping(!isLooping)}
            >
              🔁 반복 {isLooping ? '켜짐' : '꺼짐'}
            </button>
          </div>
        </div>

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
                {idx === currentIndex && <span className="playing-badge">재생 중</span>}
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
