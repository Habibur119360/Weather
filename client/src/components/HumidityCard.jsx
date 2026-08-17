import React from 'react';
import { Droplets, Thermometer, Smile, Flame, Shield } from 'lucide-react';

export default function HumidityCard({ humidityData, unit, lang }) {
  if (!humidityData) return null;

  const { value, dewPoint, comfort, comfortBn, color, summary, summaryBn } = humidityData;

  // Circular gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Dew point conversion
  const formatDewPoint = (dpC) => {
    if (dpC === undefined || dpC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((dpC * 9) / 5 + 32)}°F`;
    }
    return `${dpC}°C`;
  };

  return (
    <div className="glass-card humidity-container">
      {/* Header */}
      <div className="card-header-bar" style={{ marginBottom: 0 }}>
        <div className="card-title-group">
          <Droplets size={20} color="#06B6D4" />
          <h3>{lang === 'bn' ? 'রিয়েলটাইম আর্দ্রতা (Humidity)' : 'Real-time Relative Humidity'}</h3>
        </div>
        <div
          className="card-header-badge"
          style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.3)' }}
        >
          {lang === 'bn' ? 'বায়ুমণ্ডলীয় আর্দ্রতা' : 'Atmospheric Moisture'}
        </div>
      </div>

      {/* Main Circular Gauge & Comfort Panel */}
      <div className="humidity-main-display">
        <div className="humidity-gauge-wrap">
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              className="aqi-gauge-bg"
              cx="60"
              cy="60"
              r={radius}
            />
            <circle
              className="aqi-gauge-progress"
              cx="60"
              cy="60"
              r={radius}
              stroke="#06B6D4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="humidity-gauge-inner">
            <div className="humidity-big-num">{value}%</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
              RH
            </div>
          </div>
        </div>

        <div className="humidity-detail-col">
          <div
            className="comfort-badge"
            style={{
              background: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {value > 70 ? <Droplets size={15} /> : (value < 30 ? <Flame size={15} /> : <Smile size={15} />)}
            <span>{lang === 'bn' ? comfortBn : comfort}</span>
          </div>
          <div className="comfort-summary">
            {lang === 'bn' ? summaryBn : summary}
          </div>
        </div>
      </div>

      {/* Sub Stats: Dew Point & Comfort Index Details */}
      <div className="humidity-substats">
        <div className="substat-box">
          <div className="substat-icon-wrap">
            <Thermometer size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              {lang === 'bn' ? 'শিশিরাঙ্ক (Dew Point)' : 'Dew Point'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {formatDewPoint(dewPoint)}
            </div>
          </div>
        </div>

        <div className="substat-box">
          <div className="substat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              {lang === 'bn' ? 'স্বাচ্ছন্দ্য সূচক' : 'Comfort Range'}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10B981' }}>
              30% - 60% {lang === 'bn' ? 'আদর্শ' : 'Ideal'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
