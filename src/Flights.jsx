import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Flights.css';
import './tools/Tools.css';

// Mock Country & City Data
const COUNTRIES = [
  { 
    code: 'KR', name: 'South Korea', flag: 'kr',
    cities: [
      { code: 'ICN', name: 'Seoul (Incheon)' },
      { code: 'GMP', name: 'Seoul (Gimpo)' },
      { code: 'PUS', name: 'Busan' },
      { code: 'CJU', name: 'Jeju' }
    ]
  },
  { 
    code: 'US', name: 'United States', flag: 'us',
    cities: [
      { code: 'JFK', name: 'New York (JFK)' },
      { code: 'LAX', name: 'Los Angeles' },
      { code: 'SFO', name: 'San Francisco' },
      { code: 'ORD', name: 'Chicago' }
    ]
  },
  { 
    code: 'JP', name: 'Japan', flag: 'jp',
    cities: [
      { code: 'NRT', name: 'Tokyo (Narita)' },
      { code: 'HND', name: 'Tokyo (Haneda)' },
      { code: 'KIX', name: 'Osaka (Kansai)' },
      { code: 'FUK', name: 'Fukuoka' }
    ]
  },
  { 
    code: 'CN', name: 'China', flag: 'cn',
    cities: [
      { code: 'PEK', name: 'Beijing' },
      { code: 'PVG', name: 'Shanghai' },
      { code: 'CAN', name: 'Guangzhou' }
    ]
  },
  { 
    code: 'VN', name: 'Vietnam', flag: 'vn',
    cities: [
      { code: 'SGN', name: 'Ho Chi Minh' },
      { code: 'HAN', name: 'Hanoi' },
      { code: 'DAD', name: 'Da Nang' }
    ]
  },
  { 
    code: 'TH', name: 'Thailand', flag: 'th',
    cities: [
      { code: 'BKK', name: 'Bangkok' },
      { code: 'HKT', name: 'Phuket' },
      { code: 'CNX', name: 'Chiang Mai' }
    ]
  },
  { 
    code: 'FR', name: 'France', flag: 'fr',
    cities: [
      { code: 'CDG', name: 'Paris (CDG)' },
      { code: 'NCE', name: 'Nice' }
    ]
  },
  { 
    code: 'GB', name: 'United Kingdom', flag: 'gb',
    cities: [
      { code: 'LHR', name: 'London (Heathrow)' },
      { code: 'MAN', name: 'Manchester' }
    ]
  },
  { 
    code: 'DE', name: 'Germany', flag: 'de',
    cities: [
      { code: 'FRA', name: 'Frankfurt' },
      { code: 'MUC', name: 'Munich' }
    ]
  },
  { 
    code: 'AU', name: 'Australia', flag: 'au',
    cities: [
      { code: 'SYD', name: 'Sydney' },
      { code: 'MEL', name: 'Melbourne' }
    ]
  },
];

const AIRLINES = [
  { name: 'Korean Air', logo: '🔵' },
  { name: 'Asiana', logo: '🧧' },
  { name: 'Delta', logo: '🔺' },
  { name: 'United', logo: '🌐' },
  { name: 'JAL', logo: '🗾' },
  { name: 'Emirates', logo: '✈️' },
  { name: 'Air France', logo: '🇫🇷' },
  { name: 'Lufthansa', logo: '🦅' },
];

const LocationSelector = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('country'); // 'country' or 'city'
  const [selectedCountryCode, setSelectedCountryCode] = useState(value.country);
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.code === value.country);
  const selectedCity = selectedCountry?.cities.find(c => c.code === value.city);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setStep('country'); // Reset step on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update internal state when external value changes
  useEffect(() => {
    setSelectedCountryCode(value.country);
  }, [value.country]);

  const handleCountrySelect = (code) => {
    setSelectedCountryCode(code);
    setStep('city');
  };

  const handleCitySelect = (cityCode) => {
    onChange({ country: selectedCountryCode, city: cityCode });
    setIsOpen(false);
    setStep('country');
  };

  const handleBackToCountry = (e) => {
    e.stopPropagation();
    setStep('country');
  };

  return (
    <div className="location-input" ref={dropdownRef}>
      <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{label}</label>
      <div className="country-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry && selectedCity ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', width: '100%'}}>
            <img 
              src={`https://flagcdn.com/w40/${selectedCountry.flag}.png`} 
              alt={selectedCountry.name} 
              className="country-flag"
            />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1}}>
              <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{selectedCity.name}</span>
              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{selectedCountry.name}, {selectedCity.code}</span>
            </div>
          </div>
        ) : (
          <span>지역 선택</span>
        )}
        <span className="arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="country-options">
          {step === 'country' ? (
            <>
              <div style={{padding: '10px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                국가 선택
              </div>
              {COUNTRIES.map(country => (
                <div 
                  key={country.code} 
                  className="country-option"
                  onClick={() => handleCountrySelect(country.code)}
                >
                  <img 
                    src={`https://flagcdn.com/w40/${country.flag}.png`} 
                    alt={country.name} 
                    className="country-flag"
                  />
                  <span>{country.name}</span>
                  <span style={{marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>›</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <div 
                style={{
                  padding: '10px', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold', 
                  color: 'var(--text-secondary)', 
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)'
                }}
                onClick={handleBackToCountry}
              >
                <span style={{marginRight: '10px'}}>←</span>
                <img 
                  src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === selectedCountryCode)?.flag}.png`} 
                  alt="국기" 
                  style={{width: '20px', marginRight: '8px', borderRadius: '2px'}}
                />
                {COUNTRIES.find(c => c.code === selectedCountryCode)?.name}
              </div>
              {COUNTRIES.find(c => c.code === selectedCountryCode)?.cities.map(city => (
                <div 
                  key={city.code} 
                  className="country-option"
                  onClick={() => handleCitySelect(city.code)}
                >
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{fontWeight: 'bold'}}>{city.name}</span>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{city.code}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Flights = () => {
  const [origin, setOrigin] = useState({ country: 'KR', city: 'ICN' });
  const [destination, setDestination] = useState({ country: 'US', city: 'JFK' });
  const [tripType, setTripType] = useState('round-trip'); // 'one-way', 'round-trip'
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [isDirect, setIsDirect] = useState(false);
  const [sortOption, setSortOption] = useState('price_asc'); // price_asc, time_asc, time_desc
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const generateMockFlights = () => {
    setIsSearching(true);
    setResults([]);

    // Simulate API delay
    setTimeout(() => {
      const mockResults = [];
      const numFlights = Math.floor(Math.random() * 5) + 5; // 5-10 flights

      for (let i = 0; i < numFlights; i++) {
        const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
        const isFlightDirect = Math.random() > 0.4; // 60% chance direct
        
        // Skip if user wants direct only and this flight isn't
        if (isDirect && !isFlightDirect) continue;

        let basePrice = Math.floor(Math.random() * 1000) + 300;
        const price = isFlightDirect ? basePrice + 200 : basePrice; // Direct usually more expensive
        
        // Adjust price for round trip
        const finalPrice = tripType === 'round-trip' ? Math.floor(price * 1.8) : price;

        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const depTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const durationHours = isFlightDirect ? 10 + Math.floor(Math.random() * 4) : 15 + Math.floor(Math.random() * 10);
        
        // Calculate arrival time
        let arrHour = (hour + durationHours) % 24;
        const arrTime = `${arrHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        mockResults.push({
          id: i,
          airline: airline,
          price: finalPrice,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
          isDirect: isFlightDirect,
          originCode: origin.city,
          destinationCode: destination.city,
          tripType: tripType
        });
      }

      // Sort results
      mockResults.sort((a, b) => {
        if (sortOption === 'price_asc') return a.price - b.price;
        if (sortOption === 'time_asc') return a.departureTime.localeCompare(b.departureTime);
        if (sortOption === 'time_desc') return b.departureTime.localeCompare(a.departureTime);
        return 0;
      });

      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockFlights();
  }, [sortOption]); // Re-sort when option changes

  return (
    <div className="flights-container">
      <Link to="/" className="back-link">← 홈으로 돌아가기</Link>
      
      <div className="flights-header">
        <h1 className="flights-title">전 세계 항공권 검색 <span className="feature-icon-right">✈️</span></h1>
        <p>최저가 항공권을 찾아보세요</p>
      </div>

      <div className="search-panel">
        {/* Trip Type Selection */}
        <div className="trip-type-selector">
          <label className={`trip-type-option ${tripType === 'one-way' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="tripType" 
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={() => setTripType('one-way')}
            />
            편도
          </label>
          <label className={`trip-type-option ${tripType === 'round-trip' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="tripType" 
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={() => setTripType('round-trip')}
            />
            왕복
          </label>
        </div>

        <div className="route-selection">
          <LocationSelector 
            label="출발" 
            value={origin} 
            onChange={setOrigin} 
          />
          
          <button className="swap-button" onClick={swapLocations}>
            ⇄
          </button>
          
          <LocationSelector 
            label="도착" 
            value={destination} 
            onChange={setDestination} 
          />
        </div>

        <div className="flight-options">
          <div className="date-picker">
            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>가는 날</label>
            <input 
              type="date" 
              className="date-input" 
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {tripType === 'round-trip' && (
            <div className="date-picker">
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>오는 날</label>
              <input 
                type="date" 
                className="date-input" 
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate}
              />
            </div>
          )}

          <div className="checkbox-wrapper" onClick={() => setIsDirect(!isDirect)}>
            <input 
              type="checkbox" 
              checked={isDirect} 
              onChange={() => setIsDirect(!isDirect)}
            />
            <span>직항만 보기</span>
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>정렬</label>
            <select 
              className="sort-select" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="price_asc">최저가순</option>
              <option value="time_asc">출발 시간 빠른순</option>
              <option value="time_desc">출발 시간 늦은순</option>
            </select>
          </div>
        </div>

        <button className="search-btn" onClick={generateMockFlights}>
          {isSearching ? '검색 중...' : '항공권 검색'}
        </button>
      </div>

      <div className="results-list">
        {isSearching ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div className="spinner">✈️</div>
            <p>항공사를 스캔 중입니다...</p>
          </div>
        ) : results.length > 0 ? (
          results.map(flight => (
            <div key={flight.id} className="flight-card">
              <div className="airline-info">
                <div className="airline-logo">{flight.airline.logo}</div>
                <div>
                  <div style={{fontWeight: 'bold'}}>{flight.airline.name}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>이코노미</div>
                </div>
              </div>

              <div className="flight-route-info">
                <div className="time-row">
                  <span>{flight.departureTime}</span>
                  <div className="duration-line">
                    <span className="duration-text">{flight.duration}</span>
                    <div className="line"></div>
                    {flight.isDirect ? (
                      <span className="direct-badge">직항</span>
                    ) : (
                      <span className="stop-badge">1회 경유</span>
                    )}
                  </div>
                  <span>{flight.arrivalTime}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                  <span>{flight.originCode}</span>
                  <span>{flight.destinationCode}</span>
                </div>
                {flight.tripType === 'round-trip' && (
                  <div style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-color)', marginTop: '5px'}}>
                    왕복
                  </div>
                )}
              </div>

              <div className="price-section">
                <span className="price">${flight.price}</span>
                <button className="book-btn">선택</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px'}}>
            <p>조건에 맞는 항공권이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
