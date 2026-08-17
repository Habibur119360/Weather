import React, { useState, useEffect, useCallback } from 'react';
import WeatherBackground from './components/WeatherBackground';
import Navbar from './components/Navbar';
import WeatherHero from './components/WeatherHero';
import AqiCard from './components/AqiCard';
import HumidityCard from './components/HumidityCard';
import WeatherStats from './components/WeatherStats';
import AstronomyCard from './components/AstronomyCard';
import WeatherMap from './components/WeatherMap';
import WeatherAlerts from './components/WeatherAlerts';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { fetchWeatherData, reverseGeocodeCoords } from './services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const DEFAULT_LOCATION = {
  name: 'Dhaka',
  country: 'Bangladesh',
  latitude: 23.8103,
  longitude: 90.4125
};

export default function App() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('aeroscope_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem('aeroscope_unit') || 'C';
    } catch {
      return 'C';
    }
  });

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('aeroscope_lang') || 'bn';
    } catch {
      return 'bn';
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather and AQI for current coordinates
  const loadData = useCallback(async (loc) => {
    if (!loc || loc.latitude === undefined || loc.longitude === undefined) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc.latitude, loc.longitude);
      setWeatherData(data);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError(err.message || 'Failed to fetch real-time weather and AQI data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial and location change load
  useEffect(() => {
    loadData(location);
    try {
      localStorage.setItem('aeroscope_location', JSON.stringify(location));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [location, loadData]);

  // Update Dynamic Document Title
  useEffect(() => {
    if (weatherData?.current) {
      const temp = unit === 'F'
        ? `${Math.round((weatherData.current.temperature * 9) / 5 + 32)}°F`
        : `${Math.round(weatherData.current.temperature)}°C`;
      document.title = `${temp} ${location.name || 'AeroScope'} • Real-Time Weather & AQI`;
    }
  }, [weatherData, unit, location]);

  // Handle location selection from search or pills
  const handleSelectLocation = (newLoc) => {
    setLocation(newLoc);
  };

  // Handle GPS / Geolocation trigger
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজারে জিপিএস সুবিধা সমর্থিত নয়।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const locInfo = await reverseGeocodeCoords(lat, lon);
          setLocation({
            name: locInfo.name || 'Current Location',
            country: locInfo.country || '',
            latitude: lat,
            longitude: lon
          });
        } catch {
          setLocation({
            name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
            country: '',
            latitude: lat,
            longitude: lon
          });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoading(false);
        alert(lang === 'bn' ? 'অবস্থান শনাক্ত করা যায়নি। অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন।' : 'Could not detect location. Please allow browser location access.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle temperature unit
  const handleToggleUnit = () => {
    const nextUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    try {
      localStorage.setItem('aeroscope_unit', nextUnit);
    } catch (e) {}
  };

  // Toggle Language (EN / BN)
  const handleToggleLang = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    try {
      localStorage.setItem('aeroscope_lang', nextLang);
    } catch (e) {}
  };

  const current = weatherData?.current;
  const aqi = weatherData?.aqi;
  const ambient = current?.weather?.ambient || 'clear';
  const isDay = current ? current.isDay : true;

  return (
    <>
      {/* Interactive Weather Particles & Ambient Background */}
      <WeatherBackground ambient={ambient} isDay={isDay} />

      <main className="app-container">
        {/* Navigation & Search Header */}
        <Navbar
          currentLocation={location}
          weatherData={weatherData}
          onSelectLocation={handleSelectLocation}
          onUseGps={handleUseGps}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          lang={lang}
          onToggleLang={handleToggleLang}
          onRefresh={() => loadData(location)}
          loading={loading}
        />

        {/* Error Notification */}
        {error && (
          <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid #EF4444', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(239, 68, 68, 0.15)' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{error}</div>
            <button
              className="btn-control"
              onClick={() => loadData(location)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <RefreshCw size={13} /> {lang === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && !weatherData && (
          <div className="glass-card loading-skeleton">
            <div className="spinner" />
            <p style={{ fontWeight: 600 }}>
              {lang === 'bn' ? 'রিয়েলটাইম আবহাওয়া ও বায়ুমান তথ্য লোড হচ্ছে...' : 'Loading live weather & air quality data...'}
            </p>
          </div>
        )}

        {/* Main Content Dashboard */}
        {weatherData && (
          <>
            {/* Smart Alerts & Environmental Health Insights */}
            <WeatherAlerts weatherData={weatherData} lang={lang} />

            {/* Top Row: Weather Hero & Real-time AQI */}
            <section className="dashboard-grid">
              <WeatherHero
                weatherData={weatherData}
                locationName={location.name}
                country={location.country}
                unit={unit}
                lang={lang}
              />

              <AqiCard
                aqiData={aqi}
                lang={lang}
              />
            </section>

            {/* Middle Row: Real-time Humidity Card & Weather Secondary Stats */}
            <section className="dashboard-grid">
              <HumidityCard
                humidityData={current?.humidityInfo}
                temperature={current?.temperature}
                unit={unit}
                lang={lang}
              />

              <WeatherStats
                current={current}
                unit={unit}
                lang={lang}
              />
            </section>

            {/* Interactive Weather Radar Map */}
            <section>
              <WeatherMap
                location={location}
                weatherData={weatherData}
                unit={unit}
                lang={lang}
              />
            </section>

            {/* Astronomy & Solar Cycle Widget */}
            <section>
              <AstronomyCard
                weatherData={weatherData}
                lang={lang}
              />
            </section>

            {/* 24-Hour Hourly Forecast Strip with multi-metric tabs */}
            <section>
              <HourlyForecast
                hourlyData={weatherData.forecast?.hourly}
                unit={unit}
                lang={lang}
              />
            </section>

            {/* 7-Day Daily Forecast with expandable day drawers */}
            <section>
              <DailyForecast
                dailyData={weatherData.forecast?.daily}
                unit={unit}
                lang={lang}
              />
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-credits">
            AeroScope Live • {lang === 'bn' ? 'রিয়েলটাইম আবহাওয়া, AQI এবং আর্দ্রতা ট্র্যাকিং' : 'Real-time Weather, AQI & Humidity System'}
          </div>
          <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>
            Built with <strong>React 19</strong> • <strong>Express.js</strong> • <strong>Node.js</strong> • Leaflet Radar • Open-Meteo High-Resolution APIs
          </div>
        </footer>
      </main>
    </>
  );
}
