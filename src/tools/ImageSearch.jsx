import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Tools.css';

const ImageSearch = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const formRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    // Prevent default react submission to allow native form submission
    // But actually, we want the native submission to happen.
    // However, if we put onClick on the button, we can validate first.
    if (!selectedImage) {
      e.preventDefault();
      alert('이미지를 선택해주세요.');
    }
    // If selectedImage exists, let the form submit naturally to the action URL
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-link">← 홈으로 돌아가기</Link>
        <h1>이미지 검색기 <span className="feature-icon-right">🔍</span></h1>
        <p>사진을 찍거나 업로드하여 구글에서 검색하세요</p>
      </div>

      <div className="tool-card">
        <form 
          ref={formRef}
          action="https://google.com/searchbyimage/upload" 
          method="POST" 
          encType="multipart/form-data"
          target="_blank"
          className="image-search-form"
        >
          <div className="upload-area">
            <input 
              type="file" 
              name="encoded_image"
              accept="image/*" 
              capture="environment"
              onChange={handleImageChange}
              id="image-upload"
              className="file-input"
              style={{ display: 'none' }} 
            />
            <label htmlFor="image-upload" className="upload-label" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
              {previewUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="preview-image" 
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', border: '2px solid var(--accent-color)' }}
                  />
                  <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>이미지를 변경하려면 터치하세요</p>
                </div>
              ) : (
                <div className="upload-placeholder" style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: '10px', 
                  padding: '40px', 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.05)'
                }}>
                  <span className="camera-icon" style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>📸</span>
                  <span>사진 촬영 또는 업로드</span>
                </div>
              )}
            </label>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              type="submit" 
              className="tool-btn"
              onClick={handleSubmit}
              disabled={!selectedImage}
              style={{ opacity: selectedImage ? 1 : 0.5 }}
            >
              구글 렌즈로 검색 🔍
            </button>
          </div>
        </form>
      </div>

      <div className="tool-info">
        <h3>사용 방법</h3>
        <p>
          1. 위 영역을 눌러 사진을 찍거나 앨범에서 이미지를 선택하세요.<br/>
          2. '구글 렌즈로 검색' 버튼을 누르면 구글 이미지 검색 결과로 이동합니다.<br/>
          3. 모바일에서는 카메라가 바로 실행될 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default ImageSearch;
