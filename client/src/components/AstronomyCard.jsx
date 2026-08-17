import React from 'react';
import { Sun, Sunrise, Sunset, Sparkles, Clock } from 'lucide-react';
import { getMoonPhase } from '../utils/weatherUtils';

export default function AstronomyCard({ weatherData, lang }) {
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const moon = getMoonPhase(new Date());

  // Format sunrise / sunset times
  const formatTime = (isoTime) => {
    if (!isoTime) return '--:--';
    try {
      const d = new Date(isoTime);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  // Daylight calculation
  let daylightHours = '--';
  let daylightProgress = 50;
  let remainingDaylight = '--';

  if (current.sunrise && current.sunset) {
    try {
      const rise = new Date(current.sunrise).getTime();
      const set = new Date(current.sunset).getTime();
      const now = Date.now();

      const totalMs = Math.max(1, set - rise);
      const passedMs = Math.max(0, Math.min(totalMs, now - rise));

      const totalHours = Math.floor(totalMs / 3600000);
      const totalMinutes = Math.floor((totalMs % 3600000) / 60000);
      daylightHours = `${totalHours}h ${totalMinutes}m`;

      daylightProgress = Math.round((passedMs / totalMs) * 100);

      if (now < rise) {
        remainingDaylight = lang === 'bn' ? 'সূর্যোদয়ের অপেক্ষা' : 'Before sunrise';
      } else if (now > set) {
        remainingDaylight = lang === 'bn' ? 'সূর্যাস্ত হয়ে গেছে' : 'After sunset';
      } else {
        const remMs = set - now;
        const remH = Math.floor(remMs / 3600000);
        const remM = Math.floor((remMs % 3600000) / 60000);
        remainingDaylight = `${remH}h ${remM}m ${lang === 'bn' ? 'বাকি' : 'left'}`;
      }
    } catch (e) {
      console.warn('Daylight calculation error:', e);
    }
  }

  return (
    <div className="glass-card astronomy-container">
      {/* Header */}
      <div className="card-header-bar" style={{ marginBottom: 0 }}>
        <div className="card-title-group">
          <Sparkles size={20} color="#F59E0B" />
          <h3>{lang === 'bn' ? 'জ্যোতির্বিজ্ঞান ও চাঁদের দশা' : 'Astronomy & Lunar Cycle'}</h3>
        </div>
        <div
          className="card-header-badge"
          style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}
        >
          {lang === 'bn' ? 'সৌর ও চন্দ্র ক্যালেন্ডার' : 'Celestial Tracker'}
        </div>
      </div>

      <div className="astronomy-grid">
        {/* Moon Phase Card */}
        <div className="astro-subcard">
          <div className="astro-header-row">
            <span className="astro-label">{lang === 'bn' ? 'চাঁদের দশা (Moon Phase)' : 'Moon Phase'}</span>
            <span className="astro-val-badge">{moon.illumination}% {lang === 'bn' ? 'উজ্জ্বলতা' : 'Illumination'}</span>
          </div>

          <div className="moon-visual-row">
            {/* Visual Moon Orb with glow */}
            <div className="moon-orb-wrap">
              <div
                className="moon-orb"
                style={{
                  boxShadow: `0 0 ${10 + (moon.illumination / 10)}px rgba(224, 231, 255, ${0.3 + (moon.illumination / 200)})`
                }}
              >
                <div
                  className="moon-shadow"
                  style={{
                    transform: `scaleX(${1 - (moon.illumination / 50)})`
                  }}
                />
              </div>
            </div>

            <div className="moon-details-col">
              <div className="moon-name">{lang === 'bn' ? moon.phaseNameBn : moon.phaseName}</div>
              <div className="moon-age">
                {lang === 'bn' ? `চন্দ্র বয়স: ${moon.ageDays} দিন` : `Lunar Age: ${moon.ageDays} days`}
              </div>
              <div className="moon-desc">{moon.desc}</div>
            </div>
          </div>
        </div>

        {/* Solar Daylight Tracker Card */}
        <div className="astro-subcard">
          <div className="astro-header-row">
            <span className="astro-label">{lang === 'bn' ? 'দিনের আলো ও সূর্যাস্ত' : 'Daylight Progression'}</span>
            <span className="astro-val-badge" style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              {daylightHours} {lang === 'bn' ? 'মোট আলো' : 'Total'}
            </span>
          </div>

          <div className="daylight-arc-wrapper">
            <div className="daylight-bar-bg">
              <div
                className="daylight-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, daylightProgress))}%` }}
              />
              <div
                className="daylight-sun-marker"
                style={{ left: `${Math.min(96, Math.max(4, daylightProgress))}%` }}
                title={`${daylightProgress}% of daylight passed`}
              >
                <Sun size={14} color="#FDE047" />
              </div>
            </div>

            <div className="daylight-info-row">
              <div className="daylight-point">
                <Sunrise size={16} color="#F59E0B" />
                <div>
                  <span className="point-label">{lang === 'bn' ? 'সূর্যোদয়' : 'Sunrise'}</span>
                  <span className="point-time">{formatTime(current.sunrise)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8' }}>
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                <span>{remainingDaylight}</span>
              </div>

              <div className="daylight-point" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                <Sunset size={16} color="#F472B6" />
                <div>
                  <span className="point-label">{lang === 'bn' ? 'সূর্যাস্ত' : 'Sunset'}</span>
                  <span className="point-time">{formatTime(current.sunset)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
