import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './App.css';

const Music = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk'); // Lofi Girl Live
  
  const channels = [
    { name: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { name: 'Chillhop', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY' },
    { name: 'Coffee Shop', url: 'https://www.youtube.com/watch?v=lP26UCnoHg0' },
    { name: 'Jazz', url: 'https://www.youtube.com/watch?v=Dx5qFachd3A' }
  ];

  return (
    <div className="music-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div className="music-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Music Channel
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Focus, Relax, Sleep</p>
      </div>

      <div className="player-wrapper" style={{ 
        position: 'relative', 
        paddingTop: '56.25%', 
        borderRadius: '20px', 
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color)',
        background: '#000'
      }}>
        <ReactPlayer
          url={currentUrl}
          className="react-player"
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          playing={true}
          controls={true}
        />
      </div>

      <div className="channel-selector" style={{ 
        marginTop: '30px', 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {channels.map((channel) => (
          <button
            key={channel.name}
            onClick={() => setCurrentUrl(channel.url)}
            style={{
              padding: '12px 25px',
              borderRadius: '30px',
              border: 'none',
              background: currentUrl === channel.url ? 'var(--primary)' : 'var(--surface-dark)',
              color: currentUrl === channel.url ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: currentUrl === channel.url ? '0 5px 15px var(--primary-glow)' : 'none',
              border: '1px solid var(--border-color)'
            }}
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Music;
