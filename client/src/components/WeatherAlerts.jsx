import React from 'react';
import {
  Flame,
  CloudRain,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Droplets,
  Activity,
  Sparkles,
  Cigarette
} from 'lucide-react';
import {
  calculateCigaretteEquivalent,
  calculateActivityScore,
  generateSmartRecommendations
} from '../utils/weatherUtils';

export default function WeatherAlerts({ weatherData, lang }) {
  if (!weatherData || !weatherData.current) return null;

  const { current, aqi } = weatherData;
  const pm2_5 = aqi?.pollutants?.pm2_5?.value || 0;
  const cigarettes = calculateCigaretteEquivalent(pm2_5);
  const activity = calculateActivityScore(weatherData);
  const recommendations = generateSmartRecommendations(weatherData, lang);

  // Severe Alert Checks
  const alerts = [];
  if (current.temperature >= 36) {
    alerts.push({
      id: 'extreme-heat',
      title: lang === 'bn' ? 'তীব্র দাবদাহ সতর্কতা (Extreme Heat Alert)' : 'Extreme Heatwave Warning',
      desc: lang === 'bn' ? `তাপমাত্রা ${current.temperature}°C ছাড়িয়েছে। হিটস্ট্রোক এড়াতে ছায়ায় থাকুন এবং প্রচুর তরল পান করুন।` : `Temperatures have reached ${current.temperature}°C. Limit sun exposure to avoid heatstroke.`,
      severity: 'high',
      icon: Flame,
      color: '#EF4444'
    });
  }

  if (aqi?.usAqi >= 150) {
    alerts.push({
      id: 'hazardous-aqi',
      title: lang === 'bn' ? 'মারাত্মক বায়ুদূষণ সতর্কতা (High AQI Warning)' : 'Severe Air Pollution Alert',
      desc: lang === 'bn' ? `বায়ুমান সূচক (${aqi.usAqi}) অস্বাস্থ্যকর মাত্রায় পৌঁছেছে। বাইরে বের হলে N95 মাস্ক পরা বাধ্যতামূলক।` : `Air Quality Index (${aqi.usAqi}) is at unhealthy levels. Wear an N95 mask outdoors.`,
      severity: 'high',
      icon: ShieldAlert,
      color: '#DC2626'
    });
  }

  if (current.weather?.ambient === 'thunderstorm' || current.precipitation > 5) {
    alerts.push({
      id: 'storm-alert',
      title: lang === 'bn' ? 'বজ্রবৃষ্টি ও ভারী বর্ষণ সতর্কতা' : 'Severe Thunderstorm & Rainfall Alert',
      desc: lang === 'bn' ? 'বজ্রপাত এবং ভারী বৃষ্টিপাতের সম্ভাবনা। খোলা স্থান পরিহার করে নিরাপদ আশ্রয়ে থাকুন।' : 'Thunderstorms and heavy downpours detected. Avoid open areas and waterlogged streets.',
      severity: 'medium',
      icon: CloudRain,
      color: '#3B82F6'
    });
  }

  return (
    <div className="alerts-and-insights-wrap">
      {/* Critical Alert Banners */}
      {alerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div
            key={alert.id}
            className="glass-card alert-banner"
            style={{ borderLeft: `5px solid ${alert.color}`, background: `${alert.color}15` }}
          >
            <div className="alert-icon-wrap" style={{ background: `${alert.color}25`, color: alert.color }}>
              <Icon size={22} />
            </div>
            <div className="alert-content">
              <h4 style={{ color: alert.color, fontSize: '1rem', fontWeight: 700 }}>{alert.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginTop: '2px' }}>{alert.desc}</p>
            </div>
          </div>
        );
      })}

      {/* Health & Environmental Intelligence Grid */}
      <div className="insights-grid">
        {/* PM2.5 Inhalation Cigarette Equivalent Card */}
        <div className="glass-card insight-card">
          <div className="card-header-bar" style={{ marginBottom: 0 }}>
            <div className="card-title-group">
              <Cigarette size={18} color="#F43F5E" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                {lang === 'bn' ? 'ধূমপান সমতুল্য বায়ুদূষণ' : 'PM2.5 Cigarette Equivalent'}
              </h4>
            </div>
            <span
              className="card-header-badge"
              style={{
                background: cigarettes > 2 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: cigarettes > 2 ? '#EF4444' : '#10B981',
                borderColor: cigarettes > 2 ? '#EF444440' : '#10B98140'
              }}
            >
              Berkeley Earth
            </span>
          </div>

          <div className="cigs-display-row">
            <div className="cigs-num-box">
              <span className="cigs-val" style={{ color: cigarettes > 2 ? '#F43F5E' : '#10B981' }}>
                {cigarettes}
              </span>
              <span className="cigs-unit">{lang === 'bn' ? 'টি সিগারেট / দিন' : 'cigs / 24h'}</span>
            </div>
            <div className="cigs-desc">
              {lang === 'bn'
                ? `বর্তমান বাতাসে ২৪ ঘণ্টা নিঃশ্বাস গ্রহণ করা প্রায় ${cigarettes}টি সিগারেট খাওয়ার সমতুল্য ক্ষতিকর।`
                : `Inhaling the current air for 24 hours delivers particulate toxicity roughly equivalent to smoking ${cigarettes} cigarettes.`}
            </div>
          </div>
        </div>

        {/* Outdoor Activity & Workout Score Card */}
        <div className="glass-card insight-card">
          <div className="card-header-bar" style={{ marginBottom: 0 }}>
            <div className="card-title-group">
              <Activity size={18} color="#06B6D4" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                {lang === 'bn' ? 'আউটডোর অ্যাক্টিভিটি রেটিং' : 'Outdoor Activity Score'}
              </h4>
            </div>
            <span
              className="card-header-badge"
              style={{ background: `${activity.color}22`, color: activity.color, borderColor: `${activity.color}40` }}
            >
              {lang === 'bn' ? activity.labelBn : activity.label}
            </span>
          </div>

          <div className="activity-score-row">
            <div className="activity-circle-score" style={{ borderColor: activity.color, color: activity.color }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activity.score}</span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>/ 100</span>
            </div>
            <div className="activity-desc">
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                {lang === 'bn' ? `${activity.labelBn} পরিবেশ` : `${activity.label} for Outdoor Exertion`}
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                {lang === 'bn'
                  ? 'তাপমাত্রা, আর্দ্রতা, বাতাসের গতি, অতিবেগুনি রশ্মি ও বায়ুমান বিশ্লেষণ করে নির্ধারিত।'
                  : 'Computed from live temperature, humidity, wind gusts, UV index, and AQI particulate levels.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Daily Recommendations Bar */}
      <div className="glass-card recommendations-panel">
        <div className="card-header-bar" style={{ marginBottom: '14px' }}>
          <div className="card-title-group">
            <Sparkles size={18} color="#06B6D4" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              {lang === 'bn' ? 'স্মার্ট আবহাওয়া ও স্বাস্থ্য পরামর্শ' : 'Smart Daily Recommendations'}
            </h4>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            {lang === 'bn' ? 'রিয়েলটাইম বিশ্লেষণ' : 'Real-time AI Assist'}
          </span>
        </div>

        <div className="recs-grid">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="rec-item-card">
              <div className="rec-icon-box" style={{ background: `${rec.color}18`, color: rec.color }}>
                {rec.type === 'umbrella' && <CloudRain size={18} />}
                {rec.type === 'mask' && <ShieldCheck size={18} />}
                {rec.type === 'uv' && <Sun size={18} />}
                {rec.type === 'hydration' && <Droplets size={18} />}
              </div>
              <div className="rec-text-box">
                <span className="rec-title" style={{ color: '#fff' }}>{rec.title}</span>
                <span className="rec-desc">{rec.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
