import React, { useState, useEffect } from 'react';
import './Tools.css';

const units = {
  length: [
    { id: 'm', label: '미터 (m)', factor: 1 },
    { id: 'km', label: '킬로미터 (km)', factor: 1000 },
    { id: 'cm', label: '센티미터 (cm)', factor: 0.01 },
    { id: 'mm', label: '밀리미터 (mm)', factor: 0.001 },
    { id: 'ft', label: '피트 (ft)', factor: 0.3048 },
    { id: 'inch', label: '인치 (in)', factor: 0.0254 },
    { id: 'mile', label: '마일 (mi)', factor: 1609.344 },
    { id: 'yd', label: '야드 (yd)', factor: 0.9144 }
  ],
  weight: [
    { id: 'kg', label: '킬로그램 (kg)', factor: 1 },
    { id: 'g', label: '그램 (g)', factor: 0.001 },
    { id: 'mg', label: '밀리그램 (mg)', factor: 0.000001 },
    { id: 'lb', label: '파운드 (lb)', factor: 0.453592 },
    { id: 'oz', label: '온스 (oz)', factor: 0.0283495 }
  ],
  temperature: [
    { id: 'c', label: '섭씨 (°C)' },
    { id: 'f', label: '화씨 (°F)' },
    { id: 'k', label: '켈빈 (K)' }
  ]
};

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('length');
  const [fromValue, setFromValue] = useState(1);
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'length') {
      setFromUnit('m');
      setToUnit('ft');
    } else if (tab === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
    } else if (tab === 'temperature') {
      setFromUnit('c');
      setToUnit('f');
    }
  };

  useEffect(() => {
    const convert = () => {
      const val = parseFloat(fromValue);
      if (isNaN(val)) {
        setToValue('');
        return;
      }
  
      // Safety check for units matching the tab
      const currentUnits = units[activeTab];
      if (!currentUnits) return;
      
      // Check if current selected units exist in this tab
      const fromExists = currentUnits.find(u => u.id === fromUnit);
      const toExists = currentUnits.find(u => u.id === toUnit);
      
      // If units mismatch (during transition), don't convert yet
      if (!fromExists || !toExists) return;
  
      if (activeTab === 'temperature') {
        let result;
        // Convert to Celsius first
        let celsius;
        if (fromUnit === 'c') celsius = val;
        else if (fromUnit === 'f') celsius = (val - 32) * 5/9;
        else if (fromUnit === 'k') celsius = val - 273.15;
  
        // Convert from Celsius to Target
        if (toUnit === 'c') result = celsius;
        else if (toUnit === 'f') result = (celsius * 9/5) + 32;
        else if (toUnit === 'k') result = celsius + 273.15;
  
        setToValue(result !== undefined ? result.toFixed(2) : '');
      } else {
        // Linear conversion (Length, Weight)
        const fromFactor = fromExists.factor;
        const toFactor = toExists.factor;
        
        // Convert to base unit then to target
        const result = (val * fromFactor) / toFactor;
        
        // Format logic
        if (result > 0.01 && result < 10000) {
          setToValue(Math.round(result * 10000) / 10000);
        } else {
          setToValue(result.toPrecision(6));
        }
      }
    };
    convert();
  }, [fromValue, fromUnit, toUnit, activeTab]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>단위 변환기</h1>
        <p>자주 사용하는 단위를 변환하세요</p>
      </div>

      <div className="tool-card">
        <div className="unit-tabs">
          <button 
            className={`tab-btn ${activeTab === 'length' ? 'active' : ''}`}
            onClick={() => handleTabChange('length')}
          >
            📏 길이
          </button>
          <button 
            className={`tab-btn ${activeTab === 'weight' ? 'active' : ''}`}
            onClick={() => handleTabChange('weight')}
          >
            ⚖️ 무게
          </button>
          <button 
            className={`tab-btn ${activeTab === 'temperature' ? 'active' : ''}`}
            onClick={() => handleTabChange('temperature')}
          >
            🌡️ 온도
          </button>
        </div>

        <div className="converter-grid">
          <div className="tool-input-group">
            <label className="tool-label">변환 전</label>
            <input
              type="number"
              className="tool-input"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
            />
            <select 
              className="tool-select" 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
              style={{ marginTop: '10px' }}
            >
              {units[activeTab].map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          <button className="swap-btn" onClick={swapUnits} title="단위 바꾸기">
            ⇄
          </button>

          <div className="tool-input-group">
            <label className="tool-label">변환 후</label>
            <input
              type="text"
              className="tool-input"
              value={toValue}
              readOnly
            />
            <select 
              className="tool-select" 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
              style={{ marginTop: '10px' }}
            >
              {units[activeTab].map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
