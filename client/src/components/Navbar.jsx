import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  RefreshCw,
  Sparkles,
  Navigation,
  Globe,
  Star,
  Volume2,
  VolumeX,
  Share2,
  Check
} from 'lucide-react';
import { searchCities } from '../services/api';
import { soundSynth } from '../utils/audioSynthesizer';

const POPULAR_CITIES = [
  { name: 'Dhaka', nameBn: 'ঢাকা', lat: 23.8103, lon: 90.4125, country: 'Bangladesh' },
  { name: 'Chittagong', nameBn: 'চট্টগ্রাম', lat: 22.3569, lon: 91.7832, country: 'Bangladesh' },
  { name: 'Sylhet', nameBn: 'সিলেট', lat: 24.8949, lon: 91.8687, country: 'Bangladesh' },
  { name: 'London', nameBn: 'লন্ডন', lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
  { name: 'New York', nameBn: 'নিউ ইয়র্ক', lat: 40.7128, lon: -74.0060, country: 'United States' },
  { name: 'Tokyo', nameBn: 'টোকিও', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'Dubai', nameBn: 'দুবাই', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Singapore', nameBn: 'সিঙ্গাপুর', lat: 1.3521, lon: 103.8198, country: 'Singapore' }
];

export default function Navbar({
  currentLocation,
  weatherData,
  onSelectLocation,
  onUseGps,
  unit,
  onToggleUnit,
  lang,
  onToggleLang,
  onRefresh,
  loading
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('aeroscope_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isFavorite = favorites.some(
    (f) =>
      f.name?.toLowerCase() === currentLocation?.name?.toLowerCase() ||
      (Math.abs(f.latitude - (currentLocation?.latitude || 0)) < 0.01 &&
        Math.abs(f.longitude - (currentLocation?.longitude || 0)) < 0.01)
  );

  const toggleFavorite = () => {
    let updated;
    if (isFavorite) {
      updated = favorites.filter(
        (f) => f.name?.toLowerCase() !== currentLocation?.name?.toLowerCase()
      );
    } else {
      updated = [
        ...favorites,
        {
          name: currentLocation.name,
          country: currentLocation.country,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          admin1: currentLocation.admin1 || ''
        }
      ];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('aeroscope_favorites', JSON.stringify(updated));
    } catch (e) {}
  };

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchCities(query);
        setResults(data);
        setDropdownOpen(data.length > 0);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectLocation({
      name: city.name,
      country: city.country,
      latitude: city.latitude || city.lat,
      longitude: city.longitude || city.lon,
      admin1: city.admin1
    });
    setQuery('');
    setDropdownOpen(false);
  };

  // Ambient Sound toggle
  const handleToggleSound = () => {
    const ambient = weatherData?.current?.weather?.ambient || 'clear';
    const playing = soundSynth.toggleSound(ambient);
    setIsPlayingAudio(playing);
  };

  // Share Weather report to clipboard
  const handleShare = async () => {
    const current = weatherData?.current;
    if (!current) return;

    const temp = unit === 'F' ? `${Math.round((current.temperature * 9) / 5 + 32)}°F` : `${Math.round(current.temperature)}°C`;
    const aqi = weatherData?.aqi?.usAqi || '--';
    const condition = lang === 'bn' ? current.weather?.descriptionBn : current.weather?.description;

    const shareText = lang === 'bn'
      ? `🌤️ আবহাওয়া বুলেটিন: ${currentLocation.name}\n🌡️ তাপমাত্রা: ${temp} (${condition})\n🍃 বায়ুমান (AQI): ${aqi}\n💧 আর্দ্রতা: ${current.humidity}%\n🛰️ AeroScope Live দ্বারা সংরক্ষিত`
      : `🌤️ Weather Report for ${currentLocation.name}\n🌡️ Temp: ${temp} (${condition})\n🍃 Air Quality (AQI): ${aqi}\n💧 Humidity: ${current.humidity}%\n🛰️ AeroScope Live`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <header className="header-nav">
        {/* Brand */}
        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">AeroScope Live</div>
            <div className="brand-subtitle">
              <span className="live-pulse"></span>
              {lang === 'bn' ? 'রিয়েলটাইম আবহাওয়া ও বায়ুমান' : 'Real-time Weather & AQI'}
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-wrapper" ref={dropdownRef}>
          <div className="search-input-box">
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              className="search-input"
              placeholder={lang === 'bn' ? 'যেকোনো শহর খুঁজুন (যেমন: ঢাকা, London)...' : 'Search any city worldwide...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setDropdownOpen(true)}
            />
            {searching && <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />}
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && (
            <div className="search-dropdown">
              {results.map((item) => (
                <div
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  className="search-item"
                  onClick={() => handleSelect(item)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#06B6D4" />
                    <div>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{item.name}</span>
                      {item.admin1 && <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>, {item.admin1}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>
                    {item.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Controls */}
        <div className="nav-actions">
          {/* Bookmark / Favorite Button */}
          <button
            className={`btn-control ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Star size={15} fill={isFavorite ? '#F59E0B' : 'none'} color={isFavorite ? '#F59E0B' : '#94A3B8'} />
          </button>

          {/* Ambient Weather Sound Synthesizer */}
          <button
            className={`btn-control ${isPlayingAudio ? 'active' : ''}`}
            onClick={handleToggleSound}
            title={isPlayingAudio ? 'Mute ambient soundscape' : 'Play soothing weather soundscape'}
          >
            {isPlayingAudio ? <Volume2 size={15} color="#06B6D4" /> : <VolumeX size={15} color="#94A3B8" />}
          </button>

          {/* Share Button */}
          <button
            className="btn-control"
            onClick={handleShare}
            title={lang === 'bn' ? 'আবহাওয়া রিপোর্ট কপি করুন' : 'Share weather report'}
          >
            {copied ? <Check size={15} color="#10B981" /> : <Share2 size={15} color="#94A3B8" />}
            {copied && <span style={{ fontSize: '0.75rem', color: '#10B981' }}>{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>}
          </button>

          {/* GPS Button */}
          <button
            className="btn-control btn-gps"
            onClick={onUseGps}
            title={lang === 'bn' ? 'আমার বর্তমান অবস্থান' : 'Detect live location'}
          >
            <Navigation size={15} />
            <span className="hide-on-mobile">{lang === 'bn' ? 'আমার অবস্থান' : 'My Location'}</span>
          </button>

          {/* Unit Toggle */}
          <button
            className="btn-control"
            onClick={onToggleUnit}
            title="Toggle temperature unit"
          >
            <span style={{ color: unit === 'C' ? '#06B6D4' : '#94A3B8' }}>°C</span>
            <span style={{ color: '#475569' }}>/</span>
            <span style={{ color: unit === 'F' ? '#06B6D4' : '#94A3B8' }}>°F</span>
          </button>

          {/* Language Toggle */}
          <button
            className="btn-control"
            onClick={onToggleLang}
            title="Toggle language"
          >
            <Globe size={14} color="#06B6D4" />
            <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Refresh Button */}
          <button
            className="btn-control"
            onClick={onRefresh}
            disabled={loading}
            title={lang === 'bn' ? 'রিফ্রেশ করুন' : 'Refresh data'}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Quick City Filter Pills + Custom Favorites */}
      <div className="quick-cities-bar">
        {favorites.length > 0 && (
          <>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} fill="#F59E0B" />
              {lang === 'bn' ? 'পছন্দসমূহ:' : 'Favorites:'}
            </span>
            {favorites.map((fav) => {
              const isSelected = currentLocation?.name?.toLowerCase() === fav.name?.toLowerCase();
              return (
                <button
                  key={`fav-${fav.name}-${fav.latitude}`}
                  className={`city-pill fav-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(fav)}
                >
                  <span>{fav.name}</span>
                </button>
              );
            })}
            <span style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />
          </>
        )}

        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginRight: '4px' }}>
          {lang === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
        </span>
        {POPULAR_CITIES.map((c) => {
          const isSelected =
            currentLocation &&
            currentLocation.name &&
            currentLocation.name.toLowerCase().includes(c.name.toLowerCase());

          return (
            <button
              key={c.name}
              className={`city-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(c)}
            >
              <MapPin size={12} color={isSelected ? '#06B6D4' : '#94A3B8'} />
              <span>{lang === 'bn' ? c.nameBn : c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
