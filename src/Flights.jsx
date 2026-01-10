import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Flights.css';

// Mock Country Data
const COUNTRIES = [
  { code: 'KR', name: 'South Korea', flag: 'kr', airport: 'ICN' },
  { code: 'US', name: 'United States', flag: 'us', airport: 'JFK' },
  { code: 'JP', name: 'Japan', flag: 'jp', airport: 'NRT' },
  { code: 'CN', name: 'China', flag: 'cn', airport: 'PEK' },
  { code: 'VN', name: 'Vietnam', flag: 'vn', airport: 'SGN' },
  { code: 'TH', name: 'Thailand', flag: 'th', airport: 'BKK' },
  { code: 'FR', name: 'France', flag: 'fr', airport: 'CDG' },
  { code: 'GB', name: 'United Kingdom', flag: 'gb', airport: 'LHR' },
  { code: 'DE', name: 'Germany', flag: 'de', airport: 'FRA' },
  { code: 'AU', name: 'Australia', flag: 'au', airport: 'SYD' },
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

const CountrySelector = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.code === value);

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

  return (
    <div className="location-input" ref={dropdownRef}>
      <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{label}</label>
      <div className="country-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry ? (
          <>
            <img 
              src={`https://flagcdn.com/w40/${selectedCountry.flag}.png`} 
              alt={selectedCountry.name} 
              className="country-flag"
            />
            <span>{selectedCountry.name} ({selectedCountry.airport})</span>
          </>
        ) : (
          <span>Select Country</span>
        )}
        <span className="arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="country-options">
          {COUNTRIES.map(country => (
            <div 
              key={country.code} 
              className="country-option"
              onClick={() => handleSelect(country.code)}
            >
              <img 
                src={`https://flagcdn.com/w40/${country.flag}.png`} 
                alt={country.name} 
                className="country-flag"
              />
              <span>{country.name} ({country.airport})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Flights = () => {
  const [origin, setOrigin] = useState('KR');
  const [destination, setDestination] = useState('US');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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

        const basePrice = Math.floor(Math.random() * 1000) + 300;
        const price = isFlightDirect ? basePrice + 200 : basePrice; // Direct usually more expensive
        
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
          price: price,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
          isDirect: isFlightDirect,
          origin: COUNTRIES.find(c => c.code === origin).airport,
          destination: COUNTRIES.find(c => c.code === destination).airport
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
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div className="flights-header">
        <h1 className="flights-title">Global Flight Search</h1>
        <p>Find the best deals for your journey</p>
      </div>

      <div className="search-panel">
        <div className="route-selection">
          <CountrySelector 
            label="From" 
            value={origin} 
            onChange={setOrigin} 
          />
          
          <button className="swap-button" onClick={swapLocations}>
            ⇄
          </button>
          
          <CountrySelector 
            label="To" 
            value={destination} 
            onChange={setDestination} 
          />
        </div>

        <div className="flight-options">
          <div className="date-picker">
            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Date</label>
            <input 
              type="date" 
              className="date-input" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="checkbox-wrapper" onClick={() => setIsDirect(!isDirect)}>
            <input 
              type="checkbox" 
              checked={isDirect} 
              onChange={() => setIsDirect(!isDirect)}
            />
            <span>Direct Flights Only</span>
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Sort By</label>
            <select 
              className="sort-select" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="price_asc">Lowest Price</option>
              <option value="time_asc">Earliest Departure</option>
              <option value="time_desc">Latest Departure</option>
            </select>
          </div>
        </div>

        <button className="search-btn" onClick={generateMockFlights}>
          {isSearching ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      <div className="results-list">
        {isSearching ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div className="spinner">✈️</div>
            <p>Scanning airlines...</p>
          </div>
        ) : results.length > 0 ? (
          results.map(flight => (
            <div key={flight.id} className="flight-card">
              <div className="airline-info">
                <div className="airline-logo">{flight.airline.logo}</div>
                <div>
                  <div style={{fontWeight: 'bold'}}>{flight.airline.name}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Economy</div>
                </div>
              </div>

              <div className="flight-route-info">
                <div className="time-row">
                  <span>{flight.departureTime}</span>
                  <div className="duration-line">
                    <span className="duration-text">{flight.duration}</span>
                    <div className="line"></div>
                    {flight.isDirect ? (
                      <span className="direct-badge">Direct</span>
                    ) : (
                      <span className="stop-badge">1 Stop</span>
                    )}
                  </div>
                  <span>{flight.arrivalTime}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                  <span>{flight.origin}</span>
                  <span>{flight.destination}</span>
                </div>
              </div>

              <div className="price-section">
                <span className="price">${flight.price}</span>
                <button className="book-btn">Select</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px'}}>
            <p>No flights found for this criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
