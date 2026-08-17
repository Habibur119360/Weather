// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const WEATHER_CODES = {
  0: {
    description: 'Clear sky',
    descriptionBn: 'পরিষ্কার আকাশ',
    icon: 'Sun',
    iconNight: 'Moon',
    condition: 'clear',
    ambient: 'clear'
  },
  1: {
    description: 'Mainly clear',
    descriptionBn: 'অধিকাংশ সময় পরিষ্কার',
    icon: 'SunDim',
    iconNight: 'Moon',
    condition: 'mainly-clear',
    ambient: 'clear'
  },
  2: {
    description: 'Partly cloudy',
    descriptionBn: 'আংশিক মেঘলা',
    icon: 'CloudSun',
    iconNight: 'CloudMoon',
    condition: 'partly-cloudy',
    ambient: 'cloudy'
  },
  3: {
    description: 'Overcast',
    descriptionBn: 'মেঘাচ্ছন্ন',
    icon: 'Cloud',
    iconNight: 'Cloud',
    condition: 'overcast',
    ambient: 'cloudy'
  },
  45: {
    description: 'Fog',
    descriptionBn: 'কুয়াশা',
    icon: 'CloudFog',
    iconNight: 'CloudFog',
    condition: 'fog',
    ambient: 'fog'
  },
  48: {
    description: 'Depositing rime fog',
    descriptionBn: 'ঘন কুয়াশা',
    icon: 'CloudFog',
    iconNight: 'CloudFog',
    condition: 'fog',
    ambient: 'fog'
  },
  51: {
    description: 'Light drizzle',
    descriptionBn: 'হালকা গুঁড়ি গুঁড়ি বৃষ্টি',
    icon: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
    condition: 'drizzle',
    ambient: 'rain'
  },
  53: {
    description: 'Moderate drizzle',
    descriptionBn: 'মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি',
    icon: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
    condition: 'drizzle',
    ambient: 'rain'
  },
  55: {
    description: 'Dense drizzle',
    descriptionBn: 'ভারী গুঁড়ি গুঁড়ি বৃষ্টি',
    icon: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
    condition: 'drizzle',
    ambient: 'rain'
  },
  56: {
    description: 'Freezing drizzle',
    descriptionBn: 'হিমশীতল গুঁড়ি গুঁড়ি বৃষ্টি',
    icon: 'CloudHail',
    iconNight: 'CloudHail',
    condition: 'freezing-drizzle',
    ambient: 'snow'
  },
  57: {
    description: 'Dense freezing drizzle',
    descriptionBn: 'ভারী হিমশীতল বৃষ্টি',
    icon: 'CloudHail',
    iconNight: 'CloudHail',
    condition: 'freezing-drizzle',
    ambient: 'snow'
  },
  61: {
    description: 'Slight rain',
    descriptionBn: 'হালকা বৃষ্টি',
    icon: 'CloudRain',
    iconNight: 'CloudRain',
    condition: 'rain',
    ambient: 'rain'
  },
  63: {
    description: 'Moderate rain',
    descriptionBn: 'মাঝারি বৃষ্টিপাত',
    icon: 'CloudRain',
    iconNight: 'CloudRain',
    condition: 'rain',
    ambient: 'rain'
  },
  65: {
    description: 'Heavy rain',
    descriptionBn: 'ভারী বৃষ্টিপাত',
    icon: 'CloudRainWind',
    iconNight: 'CloudRainWind',
    condition: 'heavy-rain',
    ambient: 'rain'
  },
  66: {
    description: 'Light freezing rain',
    descriptionBn: 'হালকা জমাটবদ্ধ বৃষ্টি',
    icon: 'CloudHail',
    iconNight: 'CloudHail',
    condition: 'freezing-rain',
    ambient: 'snow'
  },
  67: {
    description: 'Heavy freezing rain',
    descriptionBn: 'ভারী জমাটবদ্ধ বৃষ্টি',
    icon: 'CloudHail',
    iconNight: 'CloudHail',
    condition: 'freezing-rain',
    ambient: 'snow'
  },
  71: {
    description: 'Slight snow fall',
    descriptionBn: 'হালকা তুষারপাত',
    icon: 'CloudSnow',
    iconNight: 'CloudSnow',
    condition: 'snow',
    ambient: 'snow'
  },
  73: {
    description: 'Moderate snow fall',
    descriptionBn: 'মাঝারি তুষারপাত',
    icon: 'CloudSnow',
    iconNight: 'CloudSnow',
    condition: 'snow',
    ambient: 'snow'
  },
  75: {
    description: 'Heavy snow fall',
    descriptionBn: 'ভারী তুষারপাত',
    icon: 'Snowflake',
    iconNight: 'Snowflake',
    condition: 'heavy-snow',
    ambient: 'snow'
  },
  77: {
    description: 'Snow grains',
    descriptionBn: 'তুষারকণা',
    icon: 'Snowflake',
    iconNight: 'Snowflake',
    condition: 'snow',
    ambient: 'snow'
  },
  80: {
    description: 'Slight rain showers',
    descriptionBn: 'হালকা বৃষ্টির ঝাপটা',
    icon: 'CloudRain',
    iconNight: 'CloudRain',
    condition: 'rain-showers',
    ambient: 'rain'
  },
  81: {
    description: 'Moderate rain showers',
    descriptionBn: 'মাঝারি বৃষ্টির ঝাপটা',
    icon: 'CloudRain',
    iconNight: 'CloudRain',
    condition: 'rain-showers',
    ambient: 'rain'
  },
  82: {
    description: 'Violent rain showers',
    descriptionBn: 'প্রবল বৃষ্টির ঝাপটা',
    icon: 'CloudRainWind',
    iconNight: 'CloudRainWind',
    condition: 'rain-showers',
    ambient: 'rain'
  },
  85: {
    description: 'Slight snow showers',
    descriptionBn: 'হালকা তুষারের ঝাপটা',
    icon: 'CloudSnow',
    iconNight: 'CloudSnow',
    condition: 'snow-showers',
    ambient: 'snow'
  },
  86: {
    description: 'Heavy snow showers',
    descriptionBn: 'ভারী তুষারের ঝাপটা',
    icon: 'Snowflake',
    iconNight: 'Snowflake',
    condition: 'snow-showers',
    ambient: 'snow'
  },
  95: {
    description: 'Thunderstorm',
    descriptionBn: 'বজ্রঝড়',
    icon: 'CloudLightning',
    iconNight: 'CloudLightning',
    condition: 'thunderstorm',
    ambient: 'thunderstorm'
  },
  96: {
    description: 'Thunderstorm with slight hail',
    descriptionBn: 'শিলাবৃষ্টিসহ বজ্রঝড়',
    icon: 'CloudLightning',
    iconNight: 'CloudLightning',
    condition: 'thunderstorm-hail',
    ambient: 'thunderstorm'
  },
  99: {
    description: 'Thunderstorm with heavy hail',
    descriptionBn: 'ভারী শিলাবৃষ্টিসহ বজ্রঝড়',
    icon: 'CloudLightning',
    iconNight: 'CloudLightning',
    condition: 'thunderstorm-hail',
    ambient: 'thunderstorm'
  }
};

const getWeatherInfo = (code, isDay = 1) => {
  const info = WEATHER_CODES[code] || {
    description: 'Unknown',
    descriptionBn: 'অজানা',
    icon: 'Cloud',
    iconNight: 'Cloud',
    condition: 'cloudy',
    ambient: 'cloudy'
  };

  return {
    code,
    description: info.description,
    descriptionBn: info.descriptionBn,
    icon: isDay ? info.icon : info.iconNight,
    condition: info.condition,
    ambient: isDay ? info.ambient : (info.ambient === 'clear' ? 'night-clear' : info.ambient),
    isDay: Boolean(isDay)
  };
};

module.exports = {
  WEATHER_CODES,
  getWeatherInfo
};
