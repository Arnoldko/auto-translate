import React, { useState, useEffect } from 'react';
import './App.css';

// Approximate bank spread for simulation (1.75%)
const SPREAD_SEND = 1.0175; // Buying rate (Bank sells to you)
const SPREAD_RECV = 0.9825; // Selling rate (Bank buys from you)

const CURRENCY_TO_COUNTRY = {
  USD: 'us', KRW: 'kr', JPY: 'jp', EUR: 'eu', CNY: 'cn', 
  GBP: 'gb', CAD: 'ca', AUD: 'au', NZD: 'nz', CHF: 'ch', 
  HKD: 'hk', SGD: 'sg', INR: 'in', PHP: 'ph', VND: 'vn', 
  THB: 'th', TWD: 'tw', MYR: 'my', IDR: 'id', RUB: 'ru',
  BRL: 'br', MXN: 'mx', ZAR: 'za', TRY: 'tr', SEK: 'se',
  // Add more as needed based on API response
};

const CURRENCY_NAMES_KO = {
  USD: '미국 달러',
  KRW: '대한민국 원',
  JPY: '일본 엔',
  EUR: '유로 (유럽연합)',
  CNY: '중국 위안',
  GBP: '영국 파운드',
  CAD: '캐나다 달러',
  AUD: '호주 달러',
  NZD: '뉴질랜드 달러',
  CHF: '스위스 프랑',
  HKD: '홍콩 달러',
  SGD: '싱가포르 달러',
  INR: '인도 루피',
  PHP: '필리핀 페소',
  VND: '베트남 동',
  THB: '태국 바트',
  TWD: '대만 달러',
  MYR: '말레이시아 링깃',
  IDR: '인도네시아 루피아',
  RUB: '러시아 루블',
  BRL: '브라질 레알',
  MXN: '멕시코 페소',
  ZAR: '남아공 랜드',
  TRY: '튀르키예 리라',
  SEK: '스웨덴 크로나',
  PLN: '폴란드 즐로티',
  DKK: '덴마크 크로네',
  NOK: '노르웨이 크로네',
  HUF: '헝가리 포린트',
  CZK: '체코 코루나',
  ILS: '이스라엘 셰켈',
  CLP: '칠레 페소',
  AED: 'UAE 디르함',
  COP: '콜롬비아 페소',
  SAR: '사우디 리얄',
  RON: '루마니아 레우',
  PEN: '페루 솔',
  KWD: '쿠웨이트 디나르',
  BHD: '바레인 디나르',
  OMR: '오만 리알',
  JOD: '요르단 디나르',
  EGP: '이집트 파운드',
  PKR: '파키스탄 루피',
  LKR: '스리랑카 루피',
  BDT: '방글라데시 타카',
  QAR: '카타르 리얄',
};

function Exchange() {
  const [rates, setRates] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [activeCurrencies, setActiveCurrencies] = useState(['USD', 'KRW', 'JPY', 'EUR']);
  
  // Bi-directional state
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [sourceAmount, setSourceAmount] = useState('1');
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch rates only once (base USD) to minimize API calls
  // We can convert USD-based rates to any pair locally
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data.result === 'success') {
          setRates(data.rates);
          setCurrencyList(Object.keys(data.rates).sort());
          setLastUpdated(new Date(data.time_last_update_utc).toLocaleString());
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleAmountChange = (currency, value) => {
    setSourceCurrency(currency);
    setSourceAmount(value);
  };

  const handleAddCurrency = (e) => {
    const currency = e.target.value;
    if (currency && !activeCurrencies.includes(currency)) {
      setActiveCurrencies([...activeCurrencies, currency]);
    }
    e.target.value = ''; // Reset select
  };

  const handleRemoveCurrency = (currency) => {
    setActiveCurrencies(activeCurrencies.filter(c => c !== currency));
  };

  const getFlagUrl = (currencyCode) => {
    const countryCode = CURRENCY_TO_COUNTRY[currencyCode] || currencyCode.slice(0, 2).toLowerCase();
    return `https://flagcdn.com/w40/${countryCode}.png`;
  };

  const calculateAmount = (targetCurrency) => {
    if (!rates[sourceCurrency] || !rates[targetCurrency]) return '---';
    
    // Convert source to USD, then USD to target
    // AmountInUSD = SourceAmount / Rate(USD->Source)
    // TargetAmount = AmountInUSD * Rate(USD->Target)
    // Formula: Target = Source * (RateTarget / RateSource)
    
    const amount = parseFloat(sourceAmount) || 0;
    const rateSource = rates[sourceCurrency];
    const rateTarget = rates[targetCurrency];
    
    return amount * (rateTarget / rateSource);
  };

  const formatNumber = (num) => {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  return (
    <div className="exchange-app">
      <div className="exchange-container">
        <h1 className="exchange-title">Global Currency Exchange</h1>
        <p className="last-updated">Last Updated: {lastUpdated}</p>

        <div className="currency-grid">
          {loading ? (
            <div className="loading-spinner">Loading Rates...</div>
          ) : (
            activeCurrencies.map(currency => {
              const isSource = currency === sourceCurrency;
              const rawAmount = isSource ? (parseFloat(sourceAmount) || 0) : calculateAmount(currency);
              const displayAmount = isSource ? sourceAmount : formatNumber(rawAmount);

              // Calculate Send/Recv amounts (simulated spread)
              // Sending (Buy): You pay more to get foreign currency (or bank sells high)
              // Receiving (Sell): You get less when selling foreign currency (or bank buys low)
              // Note: "Send" usually implies "I want to send X amount, how much does it cost?" or "I send X, how much do they get?"
              // Let's interpret user request: "Standard, Sending, Receiving rates"
              
              // Standard Rate (Mid-market)
              const standardVal = rawAmount;
              
              // Calculate Send/Recv amounts (simulated spread)
              // Send (You send / Bank Sells): You pay higher rate (Value is higher)
              // Receive (You receive / Bank Buys): You get lower rate (Value is lower)
              
              const receiveVal = standardVal * SPREAD_RECV; // Lower
              const sendVal = standardVal * SPREAD_SEND;    // Higher
              
              return (
                <div key={currency} className={`currency-row ${isSource ? 'active-source' : ''}`}>
                  <div className="row-header">
                    <div className="currency-info">
                      <img 
                        src={getFlagUrl(currency)} 
                        alt={currency} 
                        className="flag-icon"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="currency-code">{currency}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveCurrency(currency)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="row-input-container">
                    <input 
                      type="number" 
                      value={displayAmount}
                      onChange={(e) => handleAmountChange(currency, e.target.value)}
                      className="currency-input"
                      placeholder="0"
                    />
                  </div>
                  
                  {!isSource && typeof rawAmount === 'number' && (
                    <div className="rate-details">
                      <div className="rate-item">
                        <span className="rate-label">기준 (Std)</span>
                        <span className="rate-value">{formatNumber(standardVal)}</span>
                      </div>
                      <div className="rate-item">
                        <span className="rate-label">보낼때 (Send)</span>
                        <span className="rate-value highlight-send">{formatNumber(sendVal)}</span>
                      </div>
                      <div className="rate-item">
                        <span className="rate-label">받을때 (Recv)</span>
                        <span className="rate-value highlight-recv">{formatNumber(receiveVal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add New Currency */}
        <div className="add-currency-section">
          <select onChange={handleAddCurrency} className="add-currency-select" defaultValue="">
            <option value="" disabled>+ 국가/화폐 추가 (Add Currency)</option>
            {currencyList.filter(c => !activeCurrencies.includes(c)).map(c => (
              <option key={c} value={c}>
                {c} {CURRENCY_NAMES_KO[c] ? `- ${CURRENCY_NAMES_KO[c]}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Exchange;
