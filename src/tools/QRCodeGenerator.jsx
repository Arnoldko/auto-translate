import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Tools.css';

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const downloadQRCode = () => {
    try {
      const canvas = document.querySelector('#qr-code-wrapper canvas');
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert('다운로드를 생성할 수 없습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드 실패. 브라우저 권한을 확인해주세요.');
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>QR 코드 생성기</h1>
        <p>나만의 QR 코드를 즉시 생성하세요</p>
      </div>

      <div className="tool-card">
        <div className="tool-input-group">
          <label className="tool-label">내용 (URL 또는 텍스트)</label>
          <input
            type="text"
            className="tool-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="URL 또는 텍스트를 입력하세요..."
          />
        </div>

        <div className="qr-options">
          <div className="tool-input-group">
            <label className="tool-label">크기 (px)</label>
            <input
              type="number"
              className="tool-input"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min="100"
              max="1000"
            />
          </div>
          <div className="tool-input-group">
            <label className="tool-label">QR 색상</label>
            <input
              type="color"
              className="tool-input"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              style={{ height: '45px', padding: '5px' }}
            />
          </div>
          <div className="tool-input-group">
            <label className="tool-label">배경 색상</label>
            <input
              type="color"
              className="tool-input"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ height: '45px', padding: '5px' }}
            />
          </div>
        </div>

        <div className="qr-preview" id="qr-code-wrapper">
          <QRCodeCanvas
            value={text || ' '}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level={"H"}
            includeMargin={true}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="tool-btn" onClick={downloadQRCode}>
            PNG 다운로드 📥
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
