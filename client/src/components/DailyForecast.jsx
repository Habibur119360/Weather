import React, { useState } from 'react';
import { Calendar, CloudRain, Wind, Sun, Sunrise, Sunset, ChevronDown, ChevronUp } from 'lucide-react';
import { WeatherConditionIcon } from './WeatherIcons';

export default function DailyForecast({ dailyData, unit, lang }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!dailyData || dailyData.length === 0) return null;

  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') return `${Math.round((tempC * 9) / 5 + 32)}°`;
    return `${Math.round(tempC)}°`;
  };

  const formatWind = (speedKmh) => {
    if (unit === 'F') return `${Math.round(speedKmh * 0.621371)} mph`;
    return `${speedKmh} km/h`;
  };

  const formatTime = (isoTime) => {
    if (!isoTime) return '--:--';
    try {
      const d = new Date(isoTime);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  const formatDayName = (dateStr, idx) => {
    if (idx === 0) return lang === 'bn' ? 'আজ' : 'Today';
    if (idx === 1) return lang === 'bn' ? 'আগামীকাল' : 'Tomorrow';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Find min and max across all 7 days to normalize range bars
  let allMin = 100;
  let allMax = -100;
  dailyData.forEach((d) => {
    if (d.minTemp < allMin) allMin = d.minTemp;
    if (d.maxTemp > allMax) allMax = d.maxTemp;
  });
  if (allMax === allMin) allMax += 1;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="glass-card daily-container">
      <div className="card-header-bar" style={{ marginBottom: '16px' }}>
        <div className="card-title-group">
          <Calendar size={20} color="#06B6D4" />
          <h3>{lang === 'bn' ? '৭ দিনের আবহাওয়ার পূর্বাভাস' : '7-Day Extended Forecast'}</h3>
        </div>
        <div
          className="card-header-badge"
          style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
        >
          {lang === 'bn' ? 'সাপ্তাহিক পূর্বাভাস' : 'Weekly Outlook'}
        </div>
      </div>

      <div className="daily-list">
        {dailyData.map((item, idx) => {
          const minPercent = Math.max(0, Math.min(100, ((item.minTemp - allMin) / (allMax - allMin)) * 100));
          const maxPercent = Math.max(0, Math.min(100, ((item.maxTemp - allMin) / (allMax - allMin)) * 100));
          const barWidth = Math.max(15, maxPercent - minPercent);
          const isExpanded = expandedIndex === idx;

          return (
            <div key={item.date || idx} className="daily-item-wrapper">
              <div
                className="daily-row"
                onClick={() => toggleExpand(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Day Name */}
                <div className="daily-day-col">
                  {formatDayName(item.date, idx)}
                </div>

                {/* Weather icon & description */}
                <div className="daily-weather-col">
                  <WeatherConditionIcon
                    name={item.weather?.icon || 'Sun'}
                    isDay={true}
                    className="w-7 h-7"
                  />
                  <span style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
                    {lang === 'bn' ? item.weather?.descriptionBn : item.weather?.description}
                  </span>

                  {item.precipProbMax > 20 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#60A5FA', marginLeft: 'auto', marginRight: '12px' }}>
                      <CloudRain size={13} />
                      {item.precipProbMax}%
                    </span>
                  )}
                </div>

                {/* Min & Max Temp bar */}
                <div className="daily-temp-bar-col">
                  <span className="temp-min-text">{formatTemp(item.minTemp)}</span>
                  <div className="temp-bar-bg">
                    <div
                      className="temp-bar-fill"
                      style={{
                        marginLeft: `${minPercent}%`,
                        width: `${barWidth}%`
                      }}
                    />
                  </div>
                  <span className="temp-max-text">{formatTemp(item.maxTemp)}</span>
                </div>

                {/* Chevron */}
                <div style={{ color: '#94A3B8', marginLeft: '8px' }}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="daily-expanded-drawer">
                  <div className="daily-detail-chip">
                    <CloudRain size={14} color="#60A5FA" />
                    <span>{lang === 'bn' ? 'বৃষ্টিপাত:' : 'Rain:'} <strong>{item.precipSum || 0} mm ({item.precipProbMax || 0}%)</strong></span>
                  </div>
                  <div className="daily-detail-chip">
                    <Wind size={14} color="#06B6D4" />
                    <span>{lang === 'bn' ? 'সর্বোচ্চ বাতাস:' : 'Max Wind:'} <strong>{formatWind(item.windSpeedMax || 0)}</strong></span>
                  </div>
                  <div className="daily-detail-chip">
                    <Sun size={14} color="#F59E0B" />
                    <span>UV Max: <strong>{item.uvMax || 0}</strong></span>
                  </div>
                  {item.sunrise && (
                    <div className="daily-detail-chip">
                      <Sunrise size={14} color="#FBBF24" />
                      <span>{formatTime(item.sunrise)}</span>
                    </div>
                  )}
                  {item.sunset && (
                    <div className="daily-detail-chip">
                      <Sunset size={14} color="#F472B6" />
                      <span>{formatTime(item.sunset)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
