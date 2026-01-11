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

  // Spell Check State
  const [spellText, setSpellText] = useState('');
  const [spellResult, setSpellResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

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
        newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
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
      } catch (err) {
        console.error(err);
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

        {activeTab === 'spell' && (
          <div className="spell-tool">
             <div className="tool-input-group">
               <label className="tool-label">검사할 텍스트 (한국어 맞춤법)</label>
               <textarea
                 className="tool-textarea"
                 rows="10"
                 placeholder="맞춤법을 검사할 텍스트를 입력하세요..."
                 value={spellText}
                 onChange={(e) => setSpellText(e.target.value)}
                 spellCheck="false"
               ></textarea>
             </div>
             
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
               <button className="tool-btn" onClick={checkSpelling} disabled={isChecking}>
                 {isChecking ? '검사 중...' : '맞춤법 검사하기'}
               </button>
             </div>

             {spellResult && (
               <div className="spell-results" style={{ marginTop: '30px' }}>
                 <h3>검사 결과 {spellResult.length === 0 ? '✅' : `(${spellResult.length}건)`}</h3>
                 
                 {spellResult.length === 0 ? (
                   <div className="success-msg" style={{ padding: '20px', background: 'rgba(0, 255, 0, 0.1)', borderRadius: '8px', color: '#4caf50' }}>
                     발견된 맞춤법 오류가 없습니다. (단, 간단한 규칙 검사 결과입니다)
                   </div>
                 ) : (
                   <div className="error-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                     {spellResult.map((err, idx) => (
                       <div key={idx} className="error-item" style={{ 
                         padding: '15px', 
                         background: 'rgba(255, 0, 0, 0.05)', 
                         borderRadius: '8px',
                         borderLeft: '4px solid #ff4d4d',
                         textAlign: 'left'
                       }}>
                         <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                           Line {err.line}: {err.type}
                         </div>
                         <div style={{ marginBottom: '5px' }}>{err.msg}</div>
                         <div style={{ color: '#4caf50' }}>추천: {err.suggestion}</div>
                       </div>
                     ))}
                   </div>
                 )}
                 <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
                   * 이 기능은 기본적인 맞춤법 규칙(띄어쓰기, 흔한 오타)만 검사합니다. 
                   정확한 검사를 위해서는 전문 맞춤법 검사기를 이용해주세요.
                 </p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextTools;
