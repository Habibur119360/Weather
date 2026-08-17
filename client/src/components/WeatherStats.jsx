import React from 'react';
import { Sun, Sunrise, Sunset, Wind, Compass, Sparkles } from 'lucide-react';

export default function WeatherStats({ current, unit, lang }) {
  if (!current) return null;

  // Format UV index category
  const getUvCategory = (uv) => {
    if (uv <= 2) return { text: 'Low', textBn: 'নিম্ন', color: '#10B981', advice: 'No protection needed' };
    if (uv <= 5) return { text: 'Moderate', textBn: 'মাঝারি', color: '#F59E0B', advice: 'Wear sunglasses & sunscreen' };
    if (uv <= 7) return { text: 'High', textBn: 'উচ্চ', color: '#F97316', advice: 'Seek shade during midday' };
    if (uv <= 10) return { text: 'Very High', textBn: 'খুব উচ্চ', color: '#EF4444', advice: 'Extra protection required' };
    return { text: 'Extreme', textBn: 'চরম বিপজ্জনক', color: '#8B5CF6', advice: 'Avoid outdoor exposure' };
  };

  const uvCat = getUvCategory(current.uvIndex || 0);

  // Format Sunrise / Sunset
  const formatSunTime = (isoTime) => {
    if (!isoTime) return '--:--';
    try {
      const d = new Date(isoTime);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="secondary-grid">
      {/* UV Index Card */}
      <div className="glass-card stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">{lang === 'bn' ? 'ইউভি সূচক (UV Index)' : 'UV Index'}</span>
          <Sun size={20} className="stat-card-icon" style={{ color: uvCat.color }} />
        </div>
        <div className="stat-card-main">
          <div className="stat-card-val" style={{ color: uvCat.color }}>{current.uvIndex ?? 0}</div>
          <div className="stat-card-sub" style={{ fontWeight: 600, color: uvCat.color }}>
            {lang === 'bn' ? uvCat.textBn : uvCat.text}
          </div>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
          {lang === 'bn' ? 'সূর্যের ক্ষতিকর অতিবেগুনি রশ্মির মাত্রা' : uvCat.advice}
        </div>
      </div>

      {/* Wind Gusts Card */}
      <div className="glass-card stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">{lang === 'bn' ? 'বাতাসের দমকা (Gusts)' : 'Wind Gusts'}</span>
          <Wind size={20} className="stat-card-icon" />
        </div>
        <div className="stat-card-main">
          <div className="stat-card-val">
            {unit === 'F' ? `${Math.round((current.windGusts || 0) * 0.621371)} mph` : `${current.windGusts || 0} km/h`}
          </div>
          <div className="stat-card-sub">
            {lang === 'bn' ? 'সর্বোচ্চ গতিবেগ' : 'Peak gust speed'}
          </div>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Compass size={13} style={{ transform: `rotate(${current.windDirection || 0}deg)` }} />
          <span>{lang === 'bn' ? 'দিক: ' : 'Direction: '}{current.windDirection}°</span>
        </div>
      </div>

      {/* Solar Arc / Sunrise & Sunset Card */}
      <div className="glass-card stat-card sun-curve-container">
        <div className="stat-card-header">
          <span className="stat-card-title">{lang === 'bn' ? 'সূর্যোদয় ও সূর্যাস্ত' : 'Sun & Daylight Cycle'}</span>
          <Sparkles size={18} className="stat-card-icon" style={{ color: '#F59E0B' }} />
        </div>

        <div className="sun-times-row">
          <div className="sun-point">
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Sunrise size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'সূর্যোদয়' : 'Sunrise'}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {formatSunTime(current.sunrise)}
              </div>
            </div>
          </div>

          {/* Decorative Solar Curve */}
          <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '4px', background: 'linear-gradient(90deg, #F59E0B, #EC4899, #6366F1)', borderRadius: '9999px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: '#FDE047', boxShadow: '0 0 10px #FDE047' }}></div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '8px' }}>
              {lang === 'bn' ? 'দিনের আলো চক্র' : 'Daylight progression'}
            </span>
          </div>

          <div className="sun-point">
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F472B6' }}>
              <Sunset size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                {lang === 'bn' ? 'সূর্যাস্ত' : 'Sunset'}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {formatSunTime(current.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
