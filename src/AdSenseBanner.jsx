import React, { useEffect } from 'react';

const AdSenseBanner = ({ slotId, style = {}, format = 'auto', responsive = 'true' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="adsense-container" style={{ margin: '20px auto', textAlign: 'center', maxWidth: '100%' }}>
      {/* Visual Placeholder for Development/Empty State */}
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Advertisement Area</div>
      <ins
        className="adsbygoogle"
        style={{ 
            display: 'block', 
            minHeight: '100px', // Ensure it takes up space
            background: 'rgba(255, 255, 255, 0.05)', // Slight background to see the area
            border: '1px dashed rgba(255, 255, 255, 0.2)', // Dashed border to mark the spot
            ...style 
        }}
        data-ad-client="ca-pub-3409572687255324"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSenseBanner;
