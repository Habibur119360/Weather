import React, { useState, useRef } from 'react';
import { WeatherConditionIcon } from './WeatherIcons';
import { Clock, CloudRain, Droplets, Wind, Activity, ChevronLeft, ChevronRight, Thermometer } from 'lucide-react';

export default function HourlyForecast({ hourlyData, unit, lang }) {
  const [activeMetric, setActiveMetric] = useState('temp');
  const scrollRef = useRef(null);

  if (!hourlyData || hourlyData.length === 0) return null;

  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') return `${Math.round((tempC * 9) / 5 + 32)}°`;
    return `${Math.round(tempC)}°`;
  };

  const formatWind = (speedKmh) => {
    if (speedKmh === undefined || speedKmh === null) return '--';
    if (unit === 'F') return `${Math.round(speedKmh * 0.621371)} mph`;
    return `${Math.round(speedKmh)} km/h`;
  };

  const formatHour = (isoString, idx) => {
    if (idx === 0) return lang === 'bn' ? 'এখন' : 'Now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return '';
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="glass-card hourly-container">
      {/* Header Bar with Tabs and Navigation Controls */}
      <div className="card-header-bar" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="card-title-group">
          <Clock size={20} color="#06B6D4" />
          <h3>{lang === 'bn' ? '২৪ ঘণ্টার পূর্বাভাস ও আবহাওয়া সূচক' : '24-Hour Forecast & Trend'}</h3>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="hourly-metric-tabs">
          <button
            className={`metric-tab-btn ${activeMetric === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveMetric('temp')}
          >
            <Thermometer size={13} />
            <span>{lang === 'bn' ? 'তাপমাত্রা' : 'Temp'}</span>
          </button>
          <button
            className={`metric-tab-btn ${activeMetric === 'rain' ? 'active' : ''}`}
            onClick={() => setActiveMetric('rain')}
          >
            <CloudRain size={13} />
            <span>{lang === 'bn' ? 'বৃষ্টিপাত %' : 'Precip %'}</span>
          </button>
          <button
            className={`metric-tab-btn ${activeMetric === 'wind' ? 'active' : ''}`}
            onClick={() => setActiveMetric('wind')}
          >
            <Wind size={13} />
            <span>{lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
          </button>
          <button
            className={`metric-tab-btn ${activeMetric === 'aqi' ? 'active' : ''}`}
            onClick={() => setActiveMetric('aqi')}
          >
            <Activity size={13} />
            <span>AQI</span>
          </button>
        </div>

        {/* Scroll Arrows */}
        <div className="hourly-nav-btns">
          <button className="btn-icon-scroll" onClick={() => scroll('left')} title="Scroll Left">
            <ChevronLeft size={16} />
          </button>
          <button className="btn-icon-scroll" onClick={() => scroll('right')} title="Scroll Right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Hourly Scroll Cards */}
      <div className="hourly-scroll" ref={scrollRef}>
        {hourlyData.map((item, idx) => {
          let metricDisplay = null;
          if (activeMetric === 'temp') {
            metricDisplay = <span className="hourly-temp">{formatTemp(item.temperature)}</span>;
          } else if (activeMetric === 'rain') {
            metricDisplay = (
              <div className="hourly-metric-pill" style={{ color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)' }}>
                <CloudRain size={12} />
                <span>{item.precipProb ?? 0}%</span>
              </div>
            );
          } else if (activeMetric === 'wind') {
            metricDisplay = (
              <div className="hourly-metric-pill" style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.15)' }}>
                <Wind size={12} />
                <span>{formatWind(item.windSpeed)}</span>
              </div>
            );
          } else if (activeMetric === 'aqi') {
            const aqiVal = item.aqi || 45;
            const aqiColor = aqiVal <= 50 ? '#10B981' : (aqiVal <= 100 ? '#F59E0B' : '#EF4444');
            metricDisplay = (
              <div className="hourly-metric-pill" style={{ color: aqiColor, background: `${aqiColor}22` }}>
                <Activity size={12} />
                <span>{aqiVal}</span>
              </div>
            );
          }

          return (
            <div
              key={item.time || idx}
              className={`hourly-card ${idx === 0 ? 'active-hour' : ''}`}
            >
              <span className="hourly-time">{formatHour(item.time, idx)}</span>

              <div className="hourly-icon">
                <WeatherConditionIcon
                  name={item.weather?.icon || 'Sun'}
                  isDay={item.weather?.isDay}
                  className="w-8 h-8"
                />
              </div>

              {metricDisplay}

              {/* Sub-label showing secondary metric */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.68rem', color: '#94A3B8' }}>
                <Droplets size={10} color="#06B6D4" />
                <span>{item.humidity}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
