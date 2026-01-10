import React, { useState } from 'react';
import './Tools.css';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    alert('클립보드에 복사되었습니다!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>JSON 포맷터 & 검사기 <span className="feature-icon-right">📋</span></h1>
        <p>JSON 데이터 정리, 축소 및 유효성 검사</p>
      </div>

      <div className="tool-card">
        <div className="json-actions">
          <button className="tool-btn" onClick={formatJson}>정리하기 ✨</button>
          <button className="tool-btn secondary" onClick={minifyJson}>축소하기 📦</button>
          <button className="tool-btn secondary" onClick={clearAll}>지우기 🗑️</button>
        </div>

        <div className="json-grid">
          <div className="tool-input-group">
            <label className="tool-label">입력 JSON</label>
            <textarea
              className="tool-textarea json-editor"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='JSON을 여기에 붙여넣으세요 (예: {"key": "value"})'
            ></textarea>
          </div>

          <div className="tool-input-group">
            <label className="tool-label">출력</label>
            <div style={{ position: 'relative', height: '100%' }}>
              <textarea
                className={`tool-textarea json-editor ${error ? 'error-border' : ''}`}
                value={error ? error : output}
                readOnly
                placeholder="결과가 여기에 표시됩니다..."
                style={{ color: error ? '#ff4d4d' : 'inherit' }}
              ></textarea>
              {output && (
                <button 
                  className="tool-btn" 
                  onClick={copyOutput}
                  style={{ position: 'absolute', bottom: '15px', right: '15px', padding: '5px 10px', fontSize: '12px' }}
                >
                  📋 복사
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
