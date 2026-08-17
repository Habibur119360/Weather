import React from 'react';
import { Activity, ShieldCheck, Wind, Info } from 'lucide-react';

export default function AqiCard({ aqiData, lang }) {
  if (!aqiData) return null;

  const { usAqi, details, pollutants } = aqiData;

  // Gauge calculation (circumference of radius 45 is 2 * PI * 45 = 282.74)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  // AQI 0-300 maps to 0-100% of the gauge
  const progressPercent = Math.min(100, Math.max(0, (usAqi / 300) * 100));
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const statusColor = details?.color || '#10B981';

  return (
    <div className="glass-card aqi-container">
      {/* Header */}
      <div className="card-header-bar" style={{ marginBottom: 0 }}>
        <div className="card-title-group">
          <Activity size={20} color="#06B6D4" />
          <h3>{lang === 'bn' ? 'রিয়েলটাইম বায়ুমান সূচক (AQI)' : 'Real-time Air Quality (AQI)'}</h3>
        </div>
        <div
          className="card-header-badge"
          style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}
        >
          {lang === 'bn' ? details?.statusBn : details?.status}
        </div>
      </div>

      {/* Visual AQI Gauge Panel */}
      <div className="aqi-visual-panel">
        <div className="aqi-gauge-ring">
          <svg viewBox="0 0 110 110">
            <circle
              className="aqi-gauge-bg"
              cx="55"
              cy="55"
              r={radius}
            />
            <circle
              className="aqi-gauge-progress"
              cx="55"
              cy="55"
              r={radius}
              stroke={statusColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="aqi-gauge-inner">
            <div className="aqi-val-num" style={{ color: statusColor }}>{usAqi}</div>
            <div className="aqi-val-label">US AQI</div>
          </div>
        </div>

        <div className="aqi-status-info">
          <div className="aqi-status-tag" style={{ color: statusColor }}>
            {lang === 'bn' ? details?.statusBn : details?.status}
          </div>
          <div className="aqi-status-desc">
            {lang === 'bn' ? details?.descriptionBn : details?.description}
          </div>
        </div>
      </div>

      {/* Health Advisories */}
      {details?.advice && (
        <div className="health-matrix">
          <div className="health-item">
            <div className="health-icon-box">
              <ShieldCheck size={16} />
            </div>
            <div className="health-text-box">
              <span className="health-text-title">{lang === 'bn' ? 'মাস্ক পরামর্শ' : 'Mask Advice'}</span>
              <span className="health-text-desc">{lang === 'bn' ? details.advice.maskBn : details.advice.mask}</span>
            </div>
          </div>

          <div className="health-item">
            <div className="health-icon-box">
              <Activity size={16} />
            </div>
            <div className="health-text-box">
              <span className="health-text-title">{lang === 'bn' ? 'বাইরে ব্যায়াম' : 'Outdoor Exertion'}</span>
              <span className="health-text-desc">{lang === 'bn' ? details.advice.outdoorBn : details.advice.outdoor}</span>
            </div>
          </div>

          <div className="health-item">
            <div className="health-icon-box">
              <Wind size={16} />
            </div>
            <div className="health-text-box">
              <span className="health-text-title">{lang === 'bn' ? 'জানালা বায়ুচলাচল' : 'Ventilation'}</span>
              <span className="health-text-desc">{lang === 'bn' ? details.advice.ventilationBn : details.advice.ventilation}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pollutant Breakdown Matrix */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} color="#94A3B8" />
          <span>{lang === 'bn' ? 'দূষণকারী উপাদানের বিশ্লেষণ (Pollutants)' : 'Key Pollutants Concentration'}</span>
        </div>

        <div className="pollutants-grid">
          {pollutants && Object.entries(pollutants).map(([key, item]) => {
            if (key === 'dust') return null; // keep core 6 pollutants
            return (
              <div key={key} className="pollutant-card">
                <div className="pollutant-header">
                  <span className="pollutant-name">{item.name}</span>
                  <span
                    className="pollutant-status-dot"
                    style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                </div>
                <div className="pollutant-value-row">
                  <span className="pollutant-val">{item.value}</span>
                  <span className="pollutant-unit">{item.unit}</span>
                </div>
                <div className="pollutant-fullname">
                  {lang === 'bn' ? item.fullNameBn : item.fullName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
