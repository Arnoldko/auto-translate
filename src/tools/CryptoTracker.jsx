import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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

const CryptoTracker = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      fetchCoinHistory(selectedCoin.id);
    }
  }, [selectedCoin]);

  const fetchCoins = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(response.data);
      if (response.data.length > 0) {
        setSelectedCoin(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
  };

  const fetchCoinHistory = async (coinId) => {
    setChartLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: 7,
            interval: 'daily',
          },
        }
      );
      
      const prices = response.data.prices;
      const labels = prices.map(price => {
        const date = new Date(price[0]);
        return date.toLocaleDateString();
      });
      const data = prices.map(price => price[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price (USD) - Last 7 Days',
            data: data,
            borderColor: '#00c6ff',
            backgroundColor: 'rgba(0, 198, 255, 0.5)',
            tension: 0.1,
          },
        ],
      });
      setChartLoading(false);
    } catch (error) {
      console.error('Error fetching coin history:', error);
      setChartLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#ccc' }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <Link to="/" className="back-link">← 홈으로 돌아가기</Link>
        <h1>암호화폐 시세 추적기 <span className="feature-icon-right">🪙</span></h1>
        <p>CoinGecko 실시간 시세 및 트렌드</p>
      </div>

      <div className="tool-card">
        <div className="tool-input-group">
          <input
            type="text"
            className="tool-input"
            placeholder="비트코인, 이더리움 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
        ) : (
          <div className="crypto-grid">
            <div className="coin-list">
              {filteredCoins.map(coin => (
                <div 
                  key={coin.id} 
                  className={`coin-item ${selectedCoin?.id === coin.id ? 'active' : ''}`}
                  onClick={() => setSelectedCoin(coin)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={coin.image} alt={coin.name} style={{ width: '24px', height: '24px' }} />
                    <span style={{ fontWeight: 'bold' }}>{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>${coin.current_price.toLocaleString()}</div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: coin.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171' 
                    }}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="coin-detail">
              {selectedCoin && (
                <>
                  <div className="detail-header">
                    <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width: '48px', height: '48px' }} />
                    <div>
                      <h2>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</h2>
                      <div className="big-price">${selectedCoin.current_price.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="chart-container">
                    {chartLoading ? (
                      <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        차트 로딩 중...
                      </div>
                    ) : (
                      chartData && <Line options={options} data={chartData} />
                    )}
                  </div>

                  <div className="market-stats">
                    <div className="stat-box">
                      <div className="stat-label">시가총액</div>
                      <div className="stat-val">${selectedCoin.market_cap.toLocaleString()}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">24시간 고가</div>
                      <div className="stat-val">${selectedCoin.high_24h.toLocaleString()}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">24시간 저가</div>
                      <div className="stat-val">${selectedCoin.low_24h.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTracker;
