import React, { useState } from 'react';
import './Tools.css';

const TextTools = () => {
  const [activeTab, setActiveTab] = useState('counter');
  
  // Counter State
  const [text, setText] = useState('');
  
  // Diff State
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState(null);

  // Counter Logic
  const getStats = (str) => {
    if (!str) return { chars: 0, words: 0, lines: 0, noSpaces: 0 };
    return {
      chars: str.length,
      words: str.trim() === '' ? 0 : str.trim().split(/\s+/).length,
      lines: str.trim() === '' ? 0 : str.split(/\n/).length,
      noSpaces: str.replace(/\s/g, '').length
    };
  };

  const stats = getStats(text);

  // Case Logic
  const changeCase = (type) => {
    if (!text) return;
    let newText = text;
    switch(type) {
      case 'upper': newText = text.toUpperCase(); break;
      case 'lower': newText = text.toLowerCase(); break;
      case 'title': 
        newText = text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        break;
      case 'camel':
        newText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case 'sentence':
        newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'inverse':
        newText = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
    }
    setText(newText);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('클립보드에 복사되었습니다!');
      } catch (e) {
        alert('복사에 실패했습니다. 수동으로 복사해주세요.');
      }
      document.body.removeChild(textArea);
    }
  };

  // Simple Diff Logic (Visual only)
  const compareText = () => {
    if (text1 === text2) {
      setDiffResult('텍스트가 일치합니다 ✅');
    } else {
      setDiffResult('텍스트가 다릅니다 ❌');
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>텍스트 도구</h1>
        <p>텍스트 분석, 변환 및 비교</p>
      </div>

      <div className="tool-card">
        <div className="unit-tabs">
          <button 
            className={`tab-btn ${activeTab === 'counter' ? 'active' : ''}`}
            onClick={() => setActiveTab('counter')}
          >
            📊 글자수 세기 & 변환
          </button>
          <button 
            className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            ⚖️ 텍스트 비교
          </button>
        </div>

        {activeTab === 'counter' && (
          <div>
            <textarea
              className="tool-textarea"
              rows="10"
              placeholder="텍스트를 입력하거나 붙여넣으세요..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <div className="text-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.chars}</span>
                <span className="stat-label">글자수</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.words}</span>
                <span className="stat-label">단어수</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.lines}</span>
                <span className="stat-label">줄수</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.noSpaces}</span>
                <span className="stat-label">공백 제외</span>
              </div>
            </div>

            <div className="case-actions">
              <button className="tool-btn secondary" onClick={() => changeCase('upper')}>대문자로</button>
              <button className="tool-btn secondary" onClick={() => changeCase('lower')}>소문자로</button>
              <button className="tool-btn secondary" onClick={() => changeCase('title')}>제목 형식</button>
              <button className="tool-btn secondary" onClick={() => changeCase('sentence')}>문장 형식</button>
              <button className="tool-btn secondary" onClick={() => changeCase('camel')}>카멜 표기법</button>
              <button className="tool-btn secondary" onClick={() => changeCase('inverse')}>대소문자 반전</button>
              <button className="tool-btn secondary" onClick={handleCopy}>📋 복사</button>
              <button className="tool-btn secondary" onClick={() => setText('')}>🗑️ 지우기</button>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="diff-tool">
             <div className="diff-container">
               <div className="tool-input-group">
                 <label className="tool-label">원본 텍스트</label>
                 <textarea
                   className="tool-textarea"
                   rows="10"
                   value={text1}
                   onChange={(e) => setText1(e.target.value)}
                 ></textarea>
               </div>
               <div className="tool-input-group">
                 <label className="tool-label">변경된 텍스트</label>
                 <textarea
                   className="tool-textarea"
                   rows="10"
                   value={text2}
                   onChange={(e) => setText2(e.target.value)}
                 ></textarea>
               </div>
             </div>
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
               <button className="tool-btn" onClick={compareText}>텍스트 비교하기</button>
               {diffResult && (
                 <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                   {diffResult}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextTools;
