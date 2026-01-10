import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// Map language codes to country codes for flags
const LANG_TO_COUNTRY = {
  ko: 'kr',
  en: 'us',
  ja: 'jp',
  zh: 'cn',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
};

// Supported languages for translation
const LANGUAGES = [
  { code: 'ko', name: '한국어', native: '한국어' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
];

const LanguageSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLang = LANGUAGES.find(l => l.code === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
  };

  const getFlagUrl = (langCode) => {
    const countryCode = LANG_TO_COUNTRY[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
  };

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <img 
          src={getFlagUrl(value)} 
          alt={value} 
          className="lang-flag-icon"
          onError={(e) => e.target.style.display = 'none'} 
        />
        <span>{selectedLang?.native || value}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="custom-select-options">
          {LANGUAGES.map(lang => (
            <div 
              key={lang.code} 
              className={`custom-option ${lang.code === value ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <img 
                src={getFlagUrl(lang.code)} 
                alt={lang.code} 
                className="lang-flag-icon-small"
              />
              <span className="option-text">{lang.native}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// UI Text translations
const UI_TEXTS = {
  ko: {
    title: '3중 자동 번역기',
    uiLangLabel: '사용자 인터페이스 언어',
    selectLang: '언어 선택',
    placeholder: '텍스트를 입력하세요...',
    error: '번역 오류',
    translating: '번역 중...',
    poweredBy: '번역 제공: MyMemory API',
  },
  en: {
    title: 'Triple Auto Translator',
    uiLangLabel: 'Interface Language',
    selectLang: 'Select Language',
    placeholder: 'Enter text...',
    error: 'Translation Error',
    translating: 'Translating...',
    poweredBy: 'Powered by MyMemory API',
  },
  ja: {
    title: '3重自動翻訳機',
    uiLangLabel: 'インターフェース言語',
    selectLang: '言語を選択',
    placeholder: 'テキストを入力...',
    error: '翻訳エラー',
    translating: '翻訳中...',
    poweredBy: 'Powered by MyMemory API',
  },
  // Fallback for others to English
};

function Translator() {
  const [uiLang, setUiLang] = useState('ko');
  const [slots, setSlots] = useState([
    { id: 0, lang: 'ko', text: '', isLoading: false },
    { id: 1, lang: 'en', text: '', isLoading: false },
    { id: 2, lang: 'ja', text: '', isLoading: false },
  ]);

  const [copiedId, setCopiedId] = useState(null);

  const debounceTimer = useRef(null);

  // Helper to get UI text
  const t = (key) => {
    const texts = UI_TEXTS[uiLang] || UI_TEXTS['en'];
    return texts[key] || UI_TEXTS['en'][key];
  };

  const handleUiLangChange = (code) => {
    setUiLang(code);
  };

  const handleCopy = async (text, id) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSpeak = (text, lang) => {
    if (!text) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Best effort mapping for TTS voices
    utterance.lang = lang === 'zh' ? 'zh-CN' : lang; 
    
    // Optional: Try to select a specific voice if available, otherwise browser default
    window.speechSynthesis.speak(utterance);
  };

  const handleSlotLangChange = (index, newLang) => {
    const newSlots = [...slots];
    newSlots[index].lang = newLang;
    setSlots(newSlots);
    // Trigger re-translation based on the content of the *other* slots? 
    // Actually, if we change lang, we probably want to translate the current text TO the new lang 
    // OR translate FROM the other filled slot TO this new lang.
    // Let's assume we keep the text and try to translate it? No, usually changing lang implies we want the content in that lang.
    // Strategy: Find the most recently edited slot (source) and re-translate to this new target.
    // For simplicity, if there is text in *this* slot, we assume it's now in the new lang (user correction) OR we treat it as a target.
    // Let's treat the *first non-empty other slot* as the source.
    const sourceSlot = slots.find((s, i) => i !== index && s.text.trim() !== '');
    if (sourceSlot) {
      translateText(sourceSlot.text, sourceSlot.lang, index, newLang);
    }
  };

  const handleTextChange = (index, newText) => {
    const newSlots = [...slots];
    newSlots[index].text = newText;
    setSlots(newSlots);

    // Debounce translation
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (newText.trim() === '') {
        // Clear all if empty
        setSlots(slots.map(s => ({ ...s, text: '', isLoading: false })));
        return;
      }
      
      // Translate to other slots
      slots.forEach((slot, i) => {
        if (i !== index) {
          translateText(newText, newSlots[index].lang, i, slot.lang);
        }
      });
    }, 800); // 800ms debounce
  };

  const translateText = async (text, sourceLang, targetIndex, targetLang) => {
    if (!text) return;
    if (sourceLang === targetLang) {
      setSlots(prev => {
        const next = [...prev];
        next[targetIndex].text = text;
        return next;
      });
      return;
    }

    setSlots(prev => {
      const next = [...prev];
      next[targetIndex].isLoading = true;
      return next;
    });

    try {
      // Using MyMemory API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      
      if (data.responseData) {
        setSlots(prev => {
          const next = [...prev];
          next[targetIndex].text = data.responseData.translatedText;
          next[targetIndex].isLoading = false;
          return next;
        });
      } else {
        throw new Error('No data');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setSlots(prev => {
        const next = [...prev];
        next[targetIndex].text = `[${t('error')}]`;
        next[targetIndex].isLoading = false;
        return next;
      });
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <Link to="/" className="nav-btn home-btn" title="Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </Link>
        <h1>{t('title')}</h1>
        <div className="ui-lang-selector">
          <label>{t('uiLangLabel')}: </label>
          <LanguageSelector 
            value={uiLang} 
            onChange={handleUiLangChange} 
          />
        </div>
      </header>

      <div className="translator-grid">
        {slots.map((slot, index) => (
          <div key={slot.id} className="translator-slot">
            <div className="slot-header">
              <div className="select-wrapper">
                <LanguageSelector 
                  value={slot.lang} 
                  onChange={(newLang) => handleSlotLangChange(index, newLang)}
                />
              </div>
              <div className="slot-actions">
                {slot.isLoading && <span className="loading-indicator">{t('translating')}</span>}
              </div>
            </div>
            <textarea
              value={slot.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              placeholder={t('placeholder')}
              dir="auto"
            />
            <div className="slot-footer">
              <button 
                className="action-btn tts-btn"
                onClick={() => handleSpeak(slot.text, slot.lang)}
                title="Listen (TTS)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </button>
              
              <button 
                className={`action-btn copy-btn ${copiedId === slot.id ? 'copied' : ''}`}
                onClick={() => handleCopy(slot.text, slot.id)}
                title="Copy to clipboard"
                aria-label="Copy"
              >
                {copiedId === slot.id ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="btn-text">Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span className="btn-text">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="footer">
        <small>{t('poweredBy')}</small>
      </footer>
    </div>
  );
}

export default Translator;
