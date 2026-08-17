import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Maximize2, Minimize2, Navigation2, CloudRain, Eye } from 'lucide-react';

export default function WeatherMap({ location, weatherData, unit, lang }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const layerRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('precipitation');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lat = location?.latitude || 23.8103;
  const lon = location?.longitude || 90.4125;
  const cityName = location?.name || 'Selected City';
  const currentTemp = weatherData?.current?.temperature;
  const displayTemp = currentTemp !== undefined
    ? (unit === 'F' ? `${Math.round((currentTemp * 9) / 5 + 32)}°F` : `${Math.round(currentTemp)}°C`)
    : '--';
  const aqiVal = weatherData?.aqi?.usAqi || '--';
  const aqiColor = weatherData?.aqi?.details?.color || '#10B981';
  const weatherDesc = lang === 'bn'
    ? (weatherData?.current?.weather?.descriptionBn || 'আবহাওয়া')
    : (weatherData?.current?.weather?.description || 'Weather');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Dark CartoDB Baselayer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([lat, lon], map.getZoom() || 7, { animate: true });

    // Custom Marker
    const customIcon = L.divIcon({
      className: 'custom-weather-marker-wrap',
      html: `
        <div class="custom-map-marker" style="border-color: ${aqiColor}">
          <div class="marker-pulse" style="background: ${aqiColor}"></div>
          <div class="marker-badge">
            <span class="marker-temp">${displayTemp}</span>
            <span class="marker-aqi" style="background:${aqiColor}22; color:${aqiColor}">AQI ${aqiVal}</span>
          </div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 20]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
      markerRef.current.setIcon(customIcon);
    } else {
      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px 6px; min-width: 140px; color: #0F172A;">
          <h4 style="margin: 0; font-size: 1rem; font-weight: 700;">${cityName}</h4>
          <div style="margin-top: 4px; font-size: 0.85rem; color: #475569;">${weatherDesc}</div>
          <div style="margin-top: 6px; display: flex; align-items: baseline; gap: 8px;">
            <strong style="font-size: 1.2rem; color: #0284C7;">${displayTemp}</strong>
            <span style="font-size: 0.8rem; font-weight: 600; color: ${aqiColor}">AQI ${aqiVal}</span>
          </div>
        </div>
      `);
      markerRef.current = marker;
    }
  }, [lat, lon, cityName, displayTemp, aqiVal, aqiColor, weatherDesc]);

  // Update Weather Overlay Layers (RainViewer Radar / OpenSeaMap / Clouds)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (activeLayer === 'precipitation') {
      // RainViewer live global radar tiles (free & updated every 10 min)
      const radarLayer = L.tileLayer(
        'https://tilecache.rainviewer.com/v2/radar/nowcast_10/256/{z}/{x}/{y}/2/1_1.png',
        {
          opacity: 0.7,
          zIndex: 10
        }
      );
      radarLayer.addTo(map);
      layerRef.current = radarLayer;
    } else if (activeLayer === 'clouds') {
      const cloudsLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=d22d9a6a3ff2aa523d59d714a0ecd10b',
        {
          opacity: 0.5,
          zIndex: 10
        }
      );
      // Fallback safe tile layer if key expired
      cloudsLayer.addTo(map);
      layerRef.current = cloudsLayer;
    }

    // Invalidate map size after layer update
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [activeLayer]);

  const handleCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 9, { duration: 1.2 });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);
  };

  return (
    <div className={`glass-card map-card ${isFullscreen ? 'map-fullscreen' : ''}`}>
      {/* Map Header */}
      <div className="card-header-bar" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="card-title-group">
          <Layers size={20} color="#06B6D4" />
          <h3>{lang === 'bn' ? 'ইন্টারেক্টিভ আবহাওয়া ও রাডার ম্যাপ' : 'Interactive Weather & Radar Map'}</h3>
        </div>

        {/* Controls & Layer Switcher */}
        <div className="map-actions-row">
          <div className="map-layer-pills">
            <button
              className={`map-layer-btn ${activeLayer === 'precipitation' ? 'active' : ''}`}
              onClick={() => setActiveLayer('precipitation')}
            >
              <CloudRain size={13} />
              <span>{lang === 'bn' ? 'লাইভ রাডার' : 'Live Radar'}</span>
            </button>
            <button
              className={`map-layer-btn ${activeLayer === 'standard' ? 'active' : ''}`}
              onClick={() => setActiveLayer('standard')}
            >
              <Eye size={13} />
              <span>{lang === 'bn' ? 'সাধারণ' : 'Standard'}</span>
            </button>
          </div>

          <button
            className="btn-control"
            onClick={handleCenter}
            title={lang === 'bn' ? 'শহরে জুম করুন' : 'Center on city'}
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <Navigation2 size={14} color="#06B6D4" />
          </button>

          <button
            className="btn-control"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Map View Canvas Container */}
      <div className="map-view-box">
        <div ref={mapContainerRef} className="leaflet-map-canvas" />

        {/* Floating Map Info Overlay */}
        <div className="map-info-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#06B6D4" />
            <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{cityName}</strong>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            {lat.toFixed(2)}°N, {lon.toFixed(2)}°E • {displayTemp}
          </span>
        </div>
      </div>
    </div>
  );
}
