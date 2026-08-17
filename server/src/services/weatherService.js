const axios = require('axios');
const NodeCache = require('node-cache');
const { getWeatherInfo } = require('../utils/weatherCodes');
const { getAqiDetails, evaluatePollutants, getHumidityDetails } = require('../utils/aqiCalculator');

// In-memory cache with 5 minutes TTL for weather/AQI, 24h for geocoding
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch complete real-time weather, AQI, and humidity bundle for given coordinates
 */
async function getCompleteWeatherData(latitude, longitude, timezone = 'auto') {
  const cacheKey = `bundle_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [weatherRes, aqiRes] = await Promise.all([
      axios.get(WEATHER_API_URL, {
        params: {
          latitude,
          longitude,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'rain',
            'showers',
            'snowfall',
            'weather_code',
            'cloud_cover',
            'pressure_msl',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m',
            'wind_gusts_10m'
          ].join(','),
          hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'dew_point_2m',
            'apparent_temperature',
            'precipitation_probability',
            'precipitation',
            'weather_code',
            'surface_pressure',
            'cloud_cover',
            'visibility',
            'wind_speed_10m',
            'uv_index'
          ].join(','),
          daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'sunrise',
            'sunset',
            'uv_index_max',
            'precipitation_sum',
            'precipitation_probability_max',
            'wind_speed_10m_max'
          ].join(','),
          timezone
        },
        timeout: 10000
      }),
      axios.get(AQI_API_URL, {
        params: {
          latitude,
          longitude,
          current: [
            'european_aqi',
            'us_aqi',
            'pm10',
            'pm2_5',
            'carbon_monoxide',
            'nitrogen_dioxide',
            'sulphur_dioxide',
            'ozone',
            'aerosol_optical_depth',
            'dust',
            'uv_index'
          ].join(','),
          hourly: [
            'pm10',
            'pm2_5',
            'carbon_monoxide',
            'nitrogen_dioxide',
            'sulphur_dioxide',
            'ozone',
            'us_aqi'
          ].join(','),
          timezone
        },
        timeout: 10000
      })
    ]);

    const weatherData = weatherRes.data;
    const aqiData = aqiRes.data;

    // Process Current Weather
    const current = weatherData.current;
    const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
    const humidityInfo = getHumidityDetails(current.relative_humidity_2m, current.temperature_2m);
    
    // Process AQI
    const currentAqi = aqiData.current || {};
    const usAqi = currentAqi.us_aqi ?? (currentAqi.european_aqi ? Math.round(currentAqi.european_aqi * 2.5) : 45);
    const aqiDetails = getAqiDetails(usAqi);
    const pollutants = evaluatePollutants(currentAqi);

    // Process Hourly Forecast (next 24 hours)
    const hourlyTimes = weatherData.hourly.time || [];
    const nowIso = current.time;
    let startIndex = hourlyTimes.findIndex(t => t >= nowIso);
    if (startIndex === -1) startIndex = 0;

    const hourlyForecast = [];
    const hourlyAqi = aqiData.hourly || {};

    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
      const timeStr = hourlyTimes[i];
      const hCode = weatherData.hourly.weather_code[i];
      const hHour = new Date(timeStr).getHours();
      const isDayHour = hHour >= 6 && hHour < 18 ? 1 : 0;
      const hWeather = getWeatherInfo(hCode, isDayHour);

      hourlyForecast.push({
        time: timeStr,
        hour: hHour,
        temperature: Math.round(weatherData.hourly.temperature_2m[i] * 10) / 10,
        feelsLike: Math.round(weatherData.hourly.apparent_temperature[i] * 10) / 10,
        humidity: Math.round(weatherData.hourly.relative_humidity_2m[i]),
        dewPoint: Math.round(weatherData.hourly.dew_point_2m[i] * 10) / 10,
        precipProb: weatherData.hourly.precipitation_probability[i] ?? 0,
        precipitation: weatherData.hourly.precipitation[i] ?? 0,
        weatherCode: hCode,
        weather: hWeather,
        uvIndex: weatherData.hourly.uv_index ? weatherData.hourly.uv_index[i] : 0,
        windSpeed: weatherData.hourly.wind_speed_10m ? weatherData.hourly.wind_speed_10m[i] : 0,
        aqi: hourlyAqi.us_aqi ? hourlyAqi.us_aqi[i] : null
      });
    }

    // Process Daily Forecast (7 days)
    const dailyTimes = weatherData.daily.time || [];
    const dailyForecast = [];
    for (let i = 0; i < dailyTimes.length; i++) {
      const dCode = weatherData.daily.weather_code[i];
      const dWeather = getWeatherInfo(dCode, 1);
      dailyForecast.push({
        date: dailyTimes[i],
        weatherCode: dCode,
        weather: dWeather,
        maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
        minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
        sunrise: weatherData.daily.sunrise[i],
        sunset: weatherData.daily.sunset[i],
        uvMax: weatherData.daily.uv_index_max[i] ?? 0,
        precipSum: weatherData.daily.precipitation_sum[i] ?? 0,
        precipProbMax: weatherData.daily.precipitation_probability_max[i] ?? 0,
        windSpeedMax: weatherData.daily.wind_speed_10m_max[i] ?? 0
      });
    }

    // Sunrise / Sunset calculations for current day
    const todayDaily = dailyForecast[0] || {};
    const sunriseTime = todayDaily.sunrise || null;
    const sunsetTime = todayDaily.sunset || null;

    // UV Index calculation
    const currentUv = (aqiData.current && aqiData.current.uv_index !== undefined)
      ? aqiData.current.uv_index
      : (hourlyForecast[0] ? hourlyForecast[0].uvIndex : 3);

    // Assembly
    const bundle = {
      location: {
        latitude,
        longitude,
        timezone: weatherData.timezone,
        elevation: weatherData.elevation
      },
      current: {
        time: current.time,
        temperature: Math.round(current.temperature_2m * 10) / 10,
        feelsLike: Math.round(current.apparent_temperature * 10) / 10,
        humidity: current.relative_humidity_2m,
        humidityInfo,
        weatherCode: current.weather_code,
        weather: weatherInfo,
        isDay: current.is_day === 1,
        precipitation: current.precipitation,
        rain: current.rain,
        snowfall: current.snowfall,
        cloudCover: current.cloud_cover,
        pressure: Math.round(current.pressure_msl || current.surface_pressure),
        windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
        windDirection: current.wind_direction_10m,
        windGusts: Math.round((current.wind_gusts_10m || 0) * 10) / 10,
        uvIndex: Math.round(currentUv * 10) / 10,
        visibility: weatherData.hourly.visibility && weatherData.hourly.visibility[startIndex]
          ? Math.round(weatherData.hourly.visibility[startIndex] / 1000)
          : 10, // km
        sunrise: sunriseTime,
        sunset: sunsetTime
      },
      aqi: {
        usAqi,
        details: aqiDetails,
        pollutants,
        europeanAqi: currentAqi.european_aqi ?? null
      },
      forecast: {
        hourly: hourlyForecast,
        daily: dailyForecast
      },
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, bundle);
    return bundle;
  } catch (error) {
    console.error('Error fetching weather & AQI data:', error.message);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

/**
 * Search cities with autocomplete
 */
async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `geo_${query.trim().toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.get(GEOCODING_API_URL, {
      params: {
        name: query.trim(),
        count: 10,
        language: 'en',
        format: 'json'
      },
      timeout: 8000
    });

    const results = (res.data.results || []).map(item => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '', // State/Division
      admin2: item.admin2 || '', // District
      timezone: item.timezone,
      population: item.population || 0
    }));

    cache.set(cacheKey, results, 86400); // 24h
    return results;
  } catch (error) {
    console.error('Geocoding search error:', error.message);
    return [];
  }
}

/**
 * Reverse Geocode: Find city name from lat/lon
 */
async function reverseGeocode(latitude, longitude) {
  const cacheKey = `revgeo_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Attempt with BigDataCloud free client reverse geocoding API
    const res = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: {
        latitude,
        longitude,
        localityLanguage: 'en'
      },
      timeout: 6000
    });

    const data = res.data;
    const locationInfo = {
      name: data.city || data.locality || data.principalSubdivision || 'Current Location',
      country: data.countryName || '',
      countryCode: data.countryCode || '',
      admin1: data.principalSubdivision || '',
      latitude,
      longitude
    };

    cache.set(cacheKey, locationInfo, 86400);
    return locationInfo;
  } catch (error) {
    // Fallback simple naming
    return {
      name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      country: '',
      countryCode: '',
      latitude,
      longitude
    };
  }
}

module.exports = {
  getCompleteWeatherData,
  searchLocations,
  reverseGeocode
};
