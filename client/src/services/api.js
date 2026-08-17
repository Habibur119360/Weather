// API client connecting to Express backend with intelligent high-fidelity fallback
import { getWeatherInfo, getAqiDetails, evaluatePollutants, getHumidityDetails } from '../utils/weatherUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchWeatherData(lat, lon) {
  try {
    const res = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch weather');
    return json.data;
  } catch (error) {
    console.warn('API fetch error, using direct client fallback:', error);
    return fetchDirectOpenMeteo(lat, lon);
  }
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('Search API error, using direct client fallback:', error);
    const directRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    const directJson = await directRes.json();
    return (directJson.results || []).map(item => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      population: item.population || 0
    }));
  }
}

export async function reverseGeocodeCoords(lat, lon) {
  try {
    const res = await fetch(`${API_BASE_URL}/reverse-geocode?lat=${lat}&lon=${lon}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn('Reverse geocode fallback:', e);
  }

  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        latitude: lat,
        longitude: lon
      };
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode fallback failed:', e);
  }

  return {
    name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    country: '',
    latitude: lat,
    longitude: lon
  };
}

// Complete Direct client fallback in case backend is offline
async function fetchDirectOpenMeteo(latitude, longitude) {
  const [wRes, aRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,uv_index,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=auto`
    )
  ]);

  const weatherData = await wRes.json();
  const aqiData = await aRes.json();

  const current = weatherData.current;
  const currentAqi = aqiData.current || {};
  const usAqi = currentAqi.us_aqi ?? (currentAqi.european_aqi ? Math.round(currentAqi.european_aqi * 2.5) : 45);

  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day === 1);
  const humidityInfo = getHumidityDetails(current.relative_humidity_2m, current.temperature_2m);
  const aqiDetails = getAqiDetails(usAqi);
  const pollutants = evaluatePollutants(currentAqi);

  const hourlyTimes = weatherData.hourly?.time || [];
  const startIndex = Math.max(0, hourlyTimes.findIndex(t => t >= current.time));

  const hourlyForecast = [];
  for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
    const t = hourlyTimes[i];
    const code = weatherData.hourly.weather_code[i];
    const hour = new Date(t).getHours();
    const isDayHour = hour >= 6 && hour < 18;
    const hWeather = getWeatherInfo(code, isDayHour);

    hourlyForecast.push({
      time: t,
      hour,
      temperature: Math.round(weatherData.hourly.temperature_2m[i] * 10) / 10,
      feelsLike: Math.round(weatherData.hourly.apparent_temperature[i] * 10) / 10,
      humidity: Math.round(weatherData.hourly.relative_humidity_2m[i]),
      dewPoint: Math.round(weatherData.hourly.dew_point_2m[i] * 10) / 10,
      precipProb: weatherData.hourly.precipitation_probability[i] || 0,
      precipitation: weatherData.hourly.precipitation[i] || 0,
      weatherCode: code,
      weather: hWeather,
      uvIndex: weatherData.hourly.uv_index ? weatherData.hourly.uv_index[i] : 0,
      windSpeed: weatherData.hourly.wind_speed_10m ? weatherData.hourly.wind_speed_10m[i] : 0,
      aqi: aqiData.hourly?.us_aqi ? aqiData.hourly.us_aqi[i] : usAqi
    });
  }

  const dailyForecast = (weatherData.daily?.time || []).map((d, idx) => {
    const dCode = weatherData.daily.weather_code[idx];
    const dWeather = getWeatherInfo(dCode, true);
    return {
      date: d,
      weatherCode: dCode,
      weather: dWeather,
      maxTemp: Math.round(weatherData.daily.temperature_2m_max[idx]),
      minTemp: Math.round(weatherData.daily.temperature_2m_min[idx]),
      sunrise: weatherData.daily.sunrise[idx],
      sunset: weatherData.daily.sunset[idx],
      uvMax: weatherData.daily.uv_index_max[idx] || 0,
      precipSum: weatherData.daily.precipitation_sum[idx] || 0,
      precipProbMax: weatherData.daily.precipitation_probability_max[idx] || 0,
      windSpeedMax: weatherData.daily.wind_speed_10m_max[idx] || 0
    };
  });

  return {
    location: { latitude, longitude, timezone: weatherData.timezone },
    current: {
      time: current.time,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      feelsLike: Math.round(current.apparent_temperature * 10) / 10,
      humidity: current.relative_humidity_2m,
      humidityInfo,
      weatherCode: current.weather_code,
      weather: weatherInfo,
      isDay: current.is_day === 1,
      precipitation: current.precipitation || 0,
      rain: current.rain || 0,
      snowfall: current.snowfall || 0,
      cloudCover: current.cloud_cover || 0,
      pressure: Math.round(current.pressure_msl),
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      windGusts: current.wind_gusts_10m,
      uvIndex: currentAqi.uv_index || 3,
      visibility: 10,
      sunrise: weatherData.daily?.sunrise?.[0],
      sunset: weatherData.daily?.sunset?.[0]
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
}
