import React from 'react';
import { WeatherConditionIcon } from './WeatherIcons';
import { Wind, Compass, Gauge, CloudRain, Droplets, Eye, ArrowUp, ArrowDown } from 'lucide-react';

export default function WeatherHero({
  weatherData,
  locationName,
  country,
  unit,
  lang
}) {
  if (!weatherData || !weatherData.current) return null;

  const { current, forecast } = weatherData;
  const todayForecast = forecast?.daily?.[0] || {};

  // Temperature conversion
  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC * 10) / 10;
  };

  const tempDisplay = formatTemp(current.temperature);
  const feelsLikeDisplay = formatTemp(current.feelsLike);
  const maxTempDisplay = formatTemp(todayForecast.maxTemp);
  const minTempDisplay = formatTemp(todayForecast.minTemp);

  // Wind speed conversion (km/h vs mph)
  const formatWind = (speedKmh) => {
    if (unit === 'F') {
      return `${Math.round(speedKmh * 0.621371)} mph`;
    }
    return `${speedKmh} km/h`;
  };

  // Format local date / time
  const formatTime = () => {
    try {
      const date = current.time ? new Date(current.time) : new Date();
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const formatDate = () => {
    try {
      const date = new Date();
      return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="glass-card weather-hero">
      {/* Top Bar: Location & Badges */}
      <div className="hero-top">
        <div className="location-info">
          <h2>{locationName || 'Current Location'}</h2>
          <div className="location-region">
            {country && <span>{country} • </span>}
            <span>{formatDate()} • {formatTime()}</span>
          </div>
        </div>

        <div className="weather-badge">
          <span className="live-pulse"></span>
          <span>{lang === 'bn' ? 'লাইভ আপডেট' : 'Live Realtime'}</span>
        </div>
      </div>

      {/* Middle Row: Huge Temperature & Dynamic Art */}
      <div className="hero-middle">
        <div>
          <div className="main-temp">
            <span>{tempDisplay}</span>
            <span className="temp-unit">°{unit}</span>
          </div>
          <div className="feels-like-text">
            {lang === 'bn' ? 'অনুভূত হচ্ছে: ' : 'Feels like: '}
            <strong style={{ color: '#fff' }}>{feelsLikeDisplay}°{unit}</strong>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#F87171' }}>
              <ArrowUp size={14} /> {maxTempDisplay}°
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#60A5FA', marginLeft: '6px' }}>
              <ArrowDown size={14} /> {minTempDisplay}°
            </span>
          </div>
        </div>

        <div className="weather-condition-art">
          <div className="weather-art-icon">
            <WeatherConditionIcon
              name={current.weather?.icon || 'Sun'}
              isDay={current.isDay}
              className="w-20 h-20"
            />
          </div>
          <div className="condition-title">
            {lang === 'bn' ? current.weather?.descriptionBn : current.weather?.description}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Stats */}
      <div className="hero-bottom-stats">
        {/* Wind */}
        <div className="hero-stat-pill">
          <div className="stat-label">
            <Wind size={13} color="#06B6D4" />
            <span>{lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
          </div>
          <div className="stat-val">{formatWind(current.windSpeed)}</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Compass size={11} style={{ transform: `rotate(${current.windDirection || 0}deg)` }} />
            <span>{current.windDirection}°</span>
          </div>
        </div>

        {/* Humidity quick */}
        <div className="hero-stat-pill">
          <div className="stat-label">
            <Droplets size={13} color="#38BDF8" />
            <span>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
          </div>
          <div className="stat-val">{current.humidity}%</div>
          <div style={{ fontSize: '0.72rem', color: '#38BDF8' }}>
            {lang === 'bn' ? current.humidityInfo?.comfortBn : current.humidityInfo?.comfort}
          </div>
        </div>

        {/* Pressure */}
        <div className="hero-stat-pill">
          <div className="stat-label">
            <Gauge size={13} color="#A78BFA" />
            <span>{lang === 'bn' ? 'বায়ুচাপ' : 'Pressure'}</span>
          </div>
          <div className="stat-val">{current.pressure} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>hPa</span></div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
            {current.pressure >= 1013 ? (lang === 'bn' ? 'স্বাভাবিক' : 'Normal') : (lang === 'bn' ? 'নিম্নচাপ' : 'Low')}
          </div>
        </div>

        {/* Precipitation / Rain */}
        <div className="hero-stat-pill">
          <div className="stat-label">
            <CloudRain size={13} color="#60A5FA" />
            <span>{lang === 'bn' ? 'বৃষ্টিপাত' : 'Rain'}</span>
          </div>
          <div className="stat-val">{current.precipitation || 0} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>mm</span></div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
            {current.cloudCover}% {lang === 'bn' ? 'মেঘ' : 'Clouds'}
          </div>
        </div>

        {/* Visibility */}
        <div className="hero-stat-pill">
          <div className="stat-label">
            <Eye size={13} color="#34D399" />
            <span>{lang === 'bn' ? 'দৃষ্টিসীমা' : 'Visibility'}</span>
          </div>
          <div className="stat-val">{current.visibility || 10} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>km</span></div>
          <div style={{ fontSize: '0.72rem', color: '#34D399' }}>
            {lang === 'bn' ? 'পরিষ্কার' : 'Clear'}
          </div>
        </div>
      </div>
    </div>
  );
}
