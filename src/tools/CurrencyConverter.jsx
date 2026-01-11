import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Tools.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  const [rate, setRate] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const currencies = [
    { code: 'USD', name: '미국 달러', flag: '🇺🇸' },
    { code: 'KRW', name: '대한민국 원', flag: '🇰🇷' },
    { code: 'EUR', name: '유로', flag: '🇪🇺' },
    { code: 'JPY', name: '일본 엔', flag: '🇯🇵' },
    { code: 'CNY', name: '중국 위안', flag: '🇨🇳' },
    { code: 'GBP', name: '영국 파운드', flag: '🇬🇧' },
    { code: 'AUD', name: '호주 달러', flag: '🇦🇺' },
    { code: 'CAD', name: '캐나다 달러', flag: '🇨🇦' },
    { code: 'CHF', name: '스위스 프랑', flag: '🇨🇭' },
    { code: 'HKD', name: '홍콩 달러', flag: '🇭🇰' },
  ];

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        if (fromCurrency === toCurrency) {
          setRate(1);
          setLoading(false);
          return;
        }
        const response = await axios.get(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
        setRate(response.data.rates[toCurrency]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rate:', error);
        setLoading(false);
      }
    };

    const fetchHistoricalData = async () => {
      try {
        setChartLoading(true);
        if (fromCurrency === toCurrency) {
          setHistoricalData([]);
          setChartLoading(false);
          return;
        }
        
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // Last 1 month
        const startDateStr = startDate.toISOString().split('T')[0];

        const response = await axios.get(`https://api.frankfurter.app/${startDateStr}..${endDate}?from=${fromCurrency}&to=${toCurrency}`);
        
        const rates = response.data.rates;
        const dates = Object.keys(rates);
        const dataPoints = dates.map(date => rates[date][toCurrency]);

        setHistoricalData({
          labels: dates,
          datasets: [
            {
              label: `${fromCurrency} to ${toCurrency}`,
              data: dataPoints,
              borderColor: '#00e676',
              backgroundColor: 'rgba(0, 230, 118, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
        setChartLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setChartLoading(false);
      }
    };

    fetchRate();
    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#b0b0b0',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#b0b0b0',
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-link">← 홈으로 돌아가기</Link>
        <h1>환율 계산기 <span className="feature-icon-right">💱</span></h1>
        <p>실시간 환율 및 과거 데이터 차트</p>
      </div>

      <div className="currency-grid">
        <div className="tool-card converter-card">
          <h2>환율 변환</h2>
          <div className="converter-form">
            <div className="amount-input">
              <label>금액</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>

            <div className="currency-selects">
              <div className="select-group">
                <label>통화 (From)</label>
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <button className="swap-btn" onClick={handleSwap}>
                ⇄
              </button>

              <div className="select-group">
                <label>통화 (To)</label>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="conversion-result">
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <div className="result-main">
                    {amount} {fromCurrency} =
                    <span className="highlight-value"> {(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}</span>
                  </div>
                  <div className="result-sub">
                    1 {fromCurrency} = {rate} {toCurrency}
                  </div>
                </>
              )}
            </div>
            
            {/* Extended Rates Information */}
            {!loading && rate && (
              <div className="extended-rates">
                <h3>환율 상세 정보 (예상)</h3>
                <div className="rates-grid">
                  <div className="rate-item">
                    <span className="rate-label">매매기준율</span>
                    <span className="rate-value">{rate.toFixed(2)}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-label">송금 보낼 때</span>
                    <span className="rate-value up">{(rate * 1.01).toFixed(2)}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-label">송금 받을 때</span>
                    <span className="rate-value down">{(rate * 0.99).toFixed(2)}</span>
                  </div>
                </div>
                <p className="rate-note">* 위 환율은 은행 평균 스프레드(약 1%)를 적용한 추정치입니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className="tool-card chart-card">
          <h2>30일 환율 추이</h2>
          <div className="chart-container">
            {chartLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : historicalData.labels ? (
              <Line options={chartOptions} data={historicalData} />
            ) : (
              <p>과거 데이터가 없습니다</p>
            )}
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>이 도구에 대해</h3>
        <p>
          이 환율 계산기는 실시간 환율을 사용하여 주요 통화 간의 정확한 변환을 제공합니다.
          또한 30일간의 환율 변동 추이를 차트로 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
