/**
 * Weather & Atmospheric Utilities for AeroScope
 * Provides calculations, unit conversions, moon phases, and bilingual mappings
 */

export const WMO_WEATHER_CODES = {
  0: { description: 'Clear sky', descriptionBn: 'পরিষ্কার আকাশ', icon: 'Sun', iconNight: 'Moon', ambient: 'clear' },
  1: { description: 'Mainly clear', descriptionBn: 'অধিকাংশ সময় পরিষ্কার', icon: 'SunDim', iconNight: 'Moon', ambient: 'clear' },
  2: { description: 'Partly cloudy', descriptionBn: 'আংশিক মেঘলা', icon: 'CloudSun', iconNight: 'CloudMoon', ambient: 'cloudy' },
  3: { description: 'Overcast', descriptionBn: 'মেঘাচ্ছন্ন', icon: 'Cloud', iconNight: 'Cloud', ambient: 'cloudy' },
  45: { description: 'Fog', descriptionBn: 'কুয়াশা', icon: 'CloudFog', iconNight: 'CloudFog', ambient: 'fog' },
  48: { description: 'Depositing rime fog', descriptionBn: 'ঘন কুয়াশা', icon: 'CloudFog', iconNight: 'CloudFog', ambient: 'fog' },
  51: { description: 'Light drizzle', descriptionBn: 'হালকা গুঁড়ি গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle', iconNight: 'CloudDrizzle', ambient: 'rain' },
  53: { description: 'Moderate drizzle', descriptionBn: 'মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle', iconNight: 'CloudDrizzle', ambient: 'rain' },
  55: { description: 'Dense drizzle', descriptionBn: 'ভারী গুঁড়ি গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle', iconNight: 'CloudDrizzle', ambient: 'rain' },
  56: { description: 'Freezing drizzle', descriptionBn: 'হিমশীতল গুঁড়ি গুঁড়ি বৃষ্টি', icon: 'CloudHail', iconNight: 'CloudHail', ambient: 'snow' },
  57: { description: 'Dense freezing drizzle', descriptionBn: 'ভারী হিমশীতল বৃষ্টি', icon: 'CloudHail', iconNight: 'CloudHail', ambient: 'snow' },
  61: { description: 'Slight rain', descriptionBn: 'হালকা বৃষ্টি', icon: 'CloudRain', iconNight: 'CloudRain', ambient: 'rain' },
  63: { description: 'Moderate rain', descriptionBn: 'মাঝারি বৃষ্টিপাত', icon: 'CloudRain', iconNight: 'CloudRain', ambient: 'rain' },
  65: { description: 'Heavy rain', descriptionBn: 'ভারী বৃষ্টিপাত', icon: 'CloudRainWind', iconNight: 'CloudRainWind', ambient: 'rain' },
  66: { description: 'Light freezing rain', descriptionBn: 'হালকা জমাটবদ্ধ বৃষ্টি', icon: 'CloudHail', iconNight: 'CloudHail', ambient: 'snow' },
  67: { description: 'Heavy freezing rain', descriptionBn: 'ভারী জমাটবদ্ধ বৃষ্টি', icon: 'CloudHail', iconNight: 'CloudHail', ambient: 'snow' },
  71: { description: 'Slight snow fall', descriptionBn: 'হালকা তুষারপাত', icon: 'CloudSnow', iconNight: 'CloudSnow', ambient: 'snow' },
  73: { description: 'Moderate snow fall', descriptionBn: 'মাঝারি তুষারপাত', icon: 'CloudSnow', iconNight: 'CloudSnow', ambient: 'snow' },
  75: { description: 'Heavy snow fall', descriptionBn: 'ভারী তুষারপাত', icon: 'Snowflake', iconNight: 'Snowflake', ambient: 'snow' },
  77: { description: 'Snow grains', descriptionBn: 'তুষারকণা', icon: 'Snowflake', iconNight: 'Snowflake', ambient: 'snow' },
  80: { description: 'Slight rain showers', descriptionBn: 'হালকা বৃষ্টির ঝাপটা', icon: 'CloudRain', iconNight: 'CloudRain', ambient: 'rain' },
  81: { description: 'Moderate rain showers', descriptionBn: 'মাঝারি বৃষ্টির ঝাপটা', icon: 'CloudRain', iconNight: 'CloudRain', ambient: 'rain' },
  82: { description: 'Violent rain showers', descriptionBn: 'প্রবল বৃষ্টির ঝাপটা', icon: 'CloudRainWind', iconNight: 'CloudRainWind', ambient: 'rain' },
  85: { description: 'Slight snow showers', descriptionBn: 'হালকা তুষারের ঝাপটা', icon: 'CloudSnow', iconNight: 'CloudSnow', ambient: 'snow' },
  86: { description: 'Heavy snow showers', descriptionBn: 'ভারী তুষারের ঝাপটা', icon: 'Snowflake', iconNight: 'Snowflake', ambient: 'snow' },
  95: { description: 'Thunderstorm', descriptionBn: 'বজ্রঝড়', icon: 'CloudLightning', iconNight: 'CloudLightning', ambient: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', descriptionBn: 'শিলাবৃষ্টিসহ বজ্রঝড়', icon: 'CloudLightning', iconNight: 'CloudLightning', ambient: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', descriptionBn: 'ভারী শিলাবৃষ্টিসহ বজ্রঝড়', icon: 'CloudLightning', iconNight: 'CloudLightning', ambient: 'thunderstorm' }
};

export function getWeatherInfo(code, isDay = true) {
  const info = WMO_WEATHER_CODES[code] || {
    description: 'Partly Cloudy',
    descriptionBn: 'আংশিক মেঘলা',
    icon: isDay ? 'CloudSun' : 'CloudMoon',
    iconNight: 'CloudMoon',
    ambient: 'cloudy'
  };

  return {
    code,
    description: info.description,
    descriptionBn: info.descriptionBn,
    icon: isDay ? info.icon : info.iconNight,
    ambient: isDay ? info.ambient : (info.ambient === 'clear' ? 'night-clear' : info.ambient),
    isDay: Boolean(isDay)
  };
}

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    status: 'Good',
    statusBn: 'ভালো',
    category: 'good',
    color: '#10B981',
    description: 'Air quality is satisfactory and poses little or no risk.',
    descriptionBn: 'বাতাসের মান ভালো এবং কোনো স্বাস্থ্যঝুঁকি নেই।',
    advice: {
      general: 'Great day for outdoor activities!',
      generalBn: 'বাইরে ঘোরাঘুরি ও ব্যায়ামের জন্য চমৎকার পরিবেশ!',
      mask: 'Mask not needed',
      maskBn: 'মাস্ক পরার প্রয়োজন নেই',
      outdoor: 'Enjoy outdoor exercise',
      outdoorBn: 'বাইরে খেলাধুলা বা ব্যায়াম উপভোগ করুন',
      ventilation: 'Open windows for fresh air',
      ventilationBn: 'ঘরের জানালা খুলে বিশুদ্ধ বাতাস উপভোগ করতে পারেন'
    }
  },
  {
    min: 51,
    max: 100,
    status: 'Moderate',
    statusBn: 'সহনীয় / মাঝারি',
    category: 'moderate',
    color: '#F59E0B',
    description: 'Air quality is acceptable; however, some sensitive individuals may feel mild effects.',
    descriptionBn: 'বাতাসের মান গ্রহণযোগ্য, তবে সংবেদনশীল ব্যক্তিদের জন্য সামান্য স্বাস্থ্যঝুঁকি থাকতে পারে।',
    advice: {
      general: 'Acceptable air quality for most people.',
      generalBn: 'অধিকাংশ মানুষের জন্য বাতাসের মান স্বাভাবিক।',
      mask: 'Optional for sensitive individuals',
      maskBn: 'সংবেদনশীল ব্যক্তিদের জন্য মাস্ক ব্যবহার ভালো',
      outdoor: 'Safe for normal activities',
      outdoorBn: 'স্বাভাবিক কাজকর্ম নিরাপদে করা যাবে',
      ventilation: 'Safe to ventilate indoors',
      ventilationBn: 'ঘরের জানালা খোলা নিরাপদ'
    }
  },
  {
    min: 101,
    max: 150,
    status: 'Unhealthy for Sensitive Groups',
    statusBn: 'সংবেদনশীলদের জন্য অস্বাস্থ্যকর',
    category: 'sensitive',
    color: '#F97316',
    description: 'Members of sensitive groups may experience health effects. General public less likely affected.',
    descriptionBn: 'অ্যাজমা বা শ্বাসকষ্টের রোগীদের স্বাস্থ্যঝুঁকি রয়েছে। সাধারণ মানুষের কম প্রভাব পড়বে।',
    advice: {
      general: 'Sensitive groups should reduce prolonged outdoor exertion.',
      generalBn: 'সংবেদনশীল ব্যক্তিরা বাইরে অতিরিক্ত পরিশ্রম এড়িয়ে চলুন।',
      mask: 'Recommended for sensitive groups',
      maskBn: 'সংবেদনশীল ব্যক্তিদের মাস্ক পরা উচিত',
      outdoor: 'Reduce strenuous outdoor activities',
      outdoorBn: 'বাইরে অতিরিক্ত ব্যায়াম কমান',
      ventilation: 'Keep windows closed if possible',
      ventilationBn: 'সম্ভব হলে জানালা বন্ধ রাখুন'
    }
  },
  {
    min: 151,
    max: 200,
    status: 'Unhealthy',
    statusBn: 'অস্বাস্থ্যকর',
    category: 'unhealthy',
    color: '#EF4444',
    description: 'Everyone may begin to experience health effects; sensitive groups experience more serious effects.',
    descriptionBn: 'সবার জন্যই স্বাস্থ্যঝুঁকি দেখা দিতে পারে। সংবেদনশীলদের জন্য গুরুতর প্রভাব হতে পারে।',
    advice: {
      general: 'Avoid prolonged outdoor exertion. Wear protective masks.',
      generalBn: 'বাইরে বেশিক্ষণ থাকা এড়িয়ে চলুন এবং প্রতিরক্ষামূলক মাস্ক পরুন।',
      mask: 'Wear N95/protective mask outdoors',
      maskBn: 'বাইরে বের হলে N95 মাস্ক ব্যবহার করুন',
      outdoor: 'Avoid outdoor exercise',
      outdoorBn: 'বাইরে খেলাধুলা বা শরীরচর্চা থেকে বিরত থাকুন',
      ventilation: 'Use air purifiers & keep windows closed',
      ventilationBn: 'এয়ার পিউরিফায়ার ব্যবহার করুন এবং জানালা বন্ধ রাখুন'
    }
  },
  {
    min: 201,
    max: 300,
    status: 'Very Unhealthy',
    statusBn: 'খুবই অস্বাস্থ্যকর',
    category: 'very-unhealthy',
    color: '#8B5CF6',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    descriptionBn: 'স্বাস্থ্য সতর্কতা: সবার জন্য মারাত্মক স্বাস্থ্যঝুঁকি বৃদ্ধি পেয়েছে।',
    advice: {
      general: 'Active children and adults should avoid all outdoor exertion.',
      generalBn: 'শিশু, বৃদ্ধ এবং সবাইকে ঘরের বাইরে সব ধরনের শারীরিক পরিশ্রম এড়িয়ে চলতে হবে।',
      mask: 'Wear high-filtration mask at all times outside',
      maskBn: 'বাইরে গেলে সার্বক্ষণিক উন্নত মানের ফিল্টার মাস্ক পরুন',
      outdoor: 'Stay indoors as much as possible',
      outdoorBn: 'যথাসম্ভব ঘরের ভেতরে অবস্থান করুন',
      ventilation: 'Run indoor air purifiers on high',
      ventilationBn: 'ঘরের এয়ার পিউরিফায়ার চালু রাখুন'
    }
  },
  {
    min: 301,
    max: 500,
    status: 'Hazardous',
    statusBn: 'বিপজ্জনক ও মারাত্মক',
    category: 'hazardous',
    color: '#7F1D1D',
    description: 'Health warning of emergency conditions: The entire population is more likely to be affected.',
    descriptionBn: 'জরুরি স্বাস্থ্য সতর্কবার্তা: সমগ্র জনগোষ্ঠীর মারাত্মক অসুস্থ হওয়ার আশঙ্কা রয়েছে।',
    advice: {
      general: 'Emergency condition: Everyone must avoid outdoor physical activity.',
      generalBn: 'জরুরি অবস্থা: ঘরের বাইরে বের হওয়া সম্পূর্ণভাবে এড়িয়ে চলুন।',
      mask: 'Strict requirement for N95/N99 masks',
      maskBn: 'বাইরে গেলে বাধ্যতামূলক N95/N99 মাস্ক ব্যবহার করুন',
      outdoor: 'Do not go outside unless strictly necessary',
      outdoorBn: 'জরুরি প্রয়োজন ছাড়া একেবারেই বাইরে বের হবেন না',
      ventilation: 'Seal windows and maximize air purification',
      ventilationBn: 'ঘরের সব জানালা বন্ধ রাখুন ও এয়ার ক্লিনার ব্যবহার করুন'
    }
  }
];

export function getAqiDetails(usAqiValue) {
  const aqi = Math.max(0, Math.min(500, Math.round(usAqiValue || 0)));
  const level = AQI_LEVELS.find(l => aqi >= l.min && aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
  const percentage = Math.min(100, Math.round((aqi / 300) * 100));

  return {
    value: aqi,
    percentage,
    status: level.status,
    statusBn: level.statusBn,
    category: level.category,
    color: level.color,
    description: level.description,
    descriptionBn: level.descriptionBn,
    advice: level.advice
  };
}

export function evaluatePollutants(currentAir = {}) {
  const pm2_5 = currentAir.pm2_5 ?? currentAir.pm25 ?? 0;
  const pm10 = currentAir.pm10 ?? 0;
  const no2 = currentAir.nitrogen_dioxide ?? currentAir.no2 ?? 0;
  const so2 = currentAir.sulphur_dioxide ?? currentAir.so2 ?? 0;
  const co = currentAir.carbon_monoxide ?? currentAir.co ?? 0;
  const o3 = currentAir.ozone ?? currentAir.o3 ?? 0;
  const dust = currentAir.dust ?? 0;

  const getStatus = (val, thresholds, unit = 'µg/m³') => {
    let status = 'Good';
    let statusBn = 'ভালো';
    let color = '#10B981';

    if (val > thresholds.hazardous) {
      status = 'Hazardous';
      statusBn = 'বিপজ্জনক';
      color = '#7F1D1D';
    } else if (val > thresholds.veryUnhealthy) {
      status = 'Very Unhealthy';
      statusBn = 'খুবই অস্বাস্থ্যকর';
      color = '#8B5CF6';
    } else if (val > thresholds.unhealthy) {
      status = 'Unhealthy';
      statusBn = 'অস্বাস্থ্যকর';
      color = '#EF4444';
    } else if (val > thresholds.moderate) {
      status = 'Moderate';
      statusBn = 'মাঝারি';
      color = '#F59E0B';
    }

    return {
      value: Math.round(val * 10) / 10,
      unit,
      status,
      statusBn,
      color
    };
  };

  return {
    pm2_5: {
      ...getStatus(pm2_5, { moderate: 12, unhealthy: 35.4, veryUnhealthy: 55.4, hazardous: 150.4 }),
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter',
      fullNameBn: 'সূক্ষ্ম ধূলিকণা'
    },
    pm10: {
      ...getStatus(pm10, { moderate: 54, unhealthy: 154, veryUnhealthy: 254, hazardous: 354 }),
      name: 'PM10',
      fullName: 'Coarse Particulate Matter',
      fullNameBn: 'মোটাতাজা ধূলিকণা'
    },
    no2: {
      ...getStatus(no2, { moderate: 53, unhealthy: 100, veryUnhealthy: 360, hazardous: 649 }),
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      fullNameBn: 'নাইট্রোজেন ডাই-অক্সাইড'
    },
    so2: {
      ...getStatus(so2, { moderate: 35, unhealthy: 75, veryUnhealthy: 185, hazardous: 304 }),
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      fullNameBn: 'সালফার ডাই-অক্সাইড'
    },
    co: {
      ...getStatus(co, { moderate: 4400, unhealthy: 9400, veryUnhealthy: 12400, hazardous: 15400 }),
      name: 'CO',
      fullName: 'Carbon Monoxide',
      fullNameBn: 'কার্বন মনোক্সাইড'
    },
    o3: {
      ...getStatus(o3, { moderate: 54, unhealthy: 70, veryUnhealthy: 85, hazardous: 105 }),
      name: 'O₃',
      fullName: 'Ground Ozone',
      fullNameBn: 'গ্রাউন্ড ওজোন'
    },
    dust: {
      ...getStatus(dust, { moderate: 50, unhealthy: 100, veryUnhealthy: 200, hazardous: 400 }),
      name: 'Dust',
      fullName: 'Atmospheric Dust',
      fullNameBn: 'বায়ুমণ্ডলীয় ধুলোবালি'
    }
  };
}

export function getHumidityDetails(humidity, temperatureC = 25) {
  const hum = Math.max(0, Math.min(100, Math.round(humidity || 0)));
  const dewPoint = Math.round((temperatureC - ((100 - hum) / 5)) * 10) / 10;

  let comfort = 'Comfortable';
  let comfortBn = 'আরামদায়ক';
  let color = '#10B981';
  let summary = 'Ideal humidity levels for health and comfort.';
  let summaryBn = 'স্বাস্থ্য এবং স্বাচ্ছন্দ্যের জন্য আদর্শ আর্দ্রতা মাত্রা।';

  if (hum < 30) {
    comfort = 'Dry';
    comfortBn = 'শুষ্ক';
    color = '#F59E0B';
    summary = 'Air is dry. Skin may feel dry, moisturizers recommended.';
    summaryBn = 'বাতাস শুষ্ক। ত্বক আর্দ্র রাখতে ময়েশ্চারাইজার ব্যবহারের পরামর্শ।';
  } else if (hum <= 60) {
    comfort = 'Comfortable';
    comfortBn = 'আরামদায়ক ও সুষম';
    color = '#10B981';
    summary = 'Optimal relative humidity for human respiratory health.';
    summaryBn = 'শ্বাস-প্রশ্বাস ও দৈনন্দিন জীবনের জন্য সবচেয়ে আরামদায়ক মাত্রা।';
  } else if (hum <= 75) {
    comfort = 'Humid';
    comfortBn = 'আর্দ্র';
    color = '#06B6D4';
    summary = 'High moisture in air, may feel slightly sticky or warm.';
    summaryBn = 'বাতাসে জলীয় বাষ্পের পরিমাণ বেশি, শরীর সামান্য ঘামতে পারে।';
  } else {
    comfort = 'Very Humid';
    comfortBn = 'অত্যধিক আর্দ্র ও ভ্যাপসা';
    color = '#3B82F6';
    summary = 'High moisture saturation. Feels muggy with heavy sweating.';
    summaryBn = 'অত্যধিক জলীয় বাষ্প, ভ্যাপসা গরম ও প্রচুর ঘাম অনুভূত হতে পারে।';
  }

  return {
    value: hum,
    dewPoint,
    comfort,
    comfortBn,
    color,
    summary,
    summaryBn
  };
}

/**
 * Calculates PM2.5 Cigarette Equivalent based on Berkeley Earth standard
 * 22 µg/m³ of PM2.5 inhaled for 24h = ~1 cigarette
 */
export function calculateCigaretteEquivalent(pm2_5) {
  if (!pm2_5 || pm2_5 <= 0) return 0;
  const cigs = pm2_5 / 22;
  return Math.round(cigs * 10) / 10;
}

/**
 * Calculates current Moon Phase based on astronomical Julian epoch
 */
export function getMoonPhase(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }

  b = Math.floor(c / 400) - Math.floor(c / 100) + Math.floor(c / 4);
  jd = 365.25 * c + 30.6 * (e + 1) + day - 694039.09;
  jd /= 29.5305882; // Synodic month
  b = parseInt(jd);
  jd -= b;
  b = Math.round(jd * 8);

  if (b >= 8) b = 0;

  const age = Math.round(jd * 29.53 * 10) / 10;
  const illumination = Math.round((1 - Math.cos(jd * 2 * Math.PI)) / 2 * 100);

  const PHASES = [
    { name: 'New Moon', nameBn: 'অমাবস্যা', icon: 'Moon', desc: 'The Moon is between Earth and Sun' },
    { name: 'Waxing Crescent', nameBn: 'শুক্লপক্ষ ক্রিসেন্ট', icon: 'Moon', desc: 'Growing sliver of light on the right' },
    { name: 'First Quarter', nameBn: 'প্রথম পাদ', icon: 'Moon', desc: 'Half illuminated on the right side' },
    { name: 'Waxing Gibbous', nameBn: 'শুক্লপক্ষ স্ফীত চাঁদ', icon: 'Moon', desc: 'More than half illuminated and growing' },
    { name: 'Full Moon', nameBn: 'পূর্ণিমা', icon: 'Sun', desc: 'Fully illuminated face visible from Earth' },
    { name: 'Waning Gibbous', nameBn: 'কৃষ্ণপক্ষ স্ফীত চাঁদ', icon: 'Moon', desc: 'Decreasing illumination from the right' },
    { name: 'Last Quarter', nameBn: 'তৃতীয় পাদ', icon: 'Moon', desc: 'Half illuminated on the left side' },
    { name: 'Waning Crescent', nameBn: 'কৃষ্ণপক্ষ ক্রিসেন্ট', icon: 'Moon', desc: 'Fading sliver of light before New Moon' }
  ];

  const phaseInfo = PHASES[b] || PHASES[0];

  return {
    phaseIndex: b,
    phaseName: phaseInfo.name,
    phaseNameBn: phaseInfo.nameBn,
    illumination,
    ageDays: age,
    desc: phaseInfo.desc
  };
}

/**
 * Calculates Outdoor Health & Activity Rating (0 - 100)
 */
export function calculateActivityScore(weatherData) {
  if (!weatherData || !weatherData.current) return { score: 85, label: 'Great', labelBn: 'চমৎকার', color: '#10B981' };

  const current = weatherData.current;
  const aqi = weatherData.aqi?.usAqi || 50;
  const temp = current.temperature || 24;
  const rain = current.precipitation || 0;
  const uv = current.uvIndex || 3;
  const wind = current.windSpeed || 10;

  let score = 100;

  // AQI deduction
  if (aqi > 50) score -= (aqi - 50) * 0.35;
  if (aqi > 150) score -= (aqi - 150) * 0.4;

  // Temp deduction (ideal 18°C - 26°C)
  if (temp < 15) score -= (15 - temp) * 2;
  if (temp > 30) score -= (temp - 30) * 3;

  // Rain deduction
  if (rain > 0.5) score -= rain * 8;

  // UV deduction
  if (uv > 7) score -= (uv - 7) * 4;

  // Wind deduction
  if (wind > 35) score -= (wind - 35) * 1.5;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label = 'Excellent';
  let labelBn = 'চমৎকার';
  let color = '#10B981';

  if (score < 40) {
    label = 'Poor';
    labelBn = 'প্রতিকূল';
    color = '#EF4444';
  } else if (score < 65) {
    label = 'Moderate';
    labelBn = 'মাঝারি';
    color = '#F59E0B';
  } else if (score < 85) {
    label = 'Good';
    labelBn = 'ভালো';
    color = '#06B6D4';
  }

  return { score, label, labelBn, color };
}

/**
 * Generate Smart Weather & Environmental Recommendations
 */
export function generateSmartRecommendations(weatherData, lang = 'en') {
  if (!weatherData || !weatherData.current) return [];

  const current = weatherData.current;
  const aqi = weatherData.aqi?.usAqi || 45;
  const temp = current.temperature || 24;
  const rain = current.precipitation || 0;
  const uv = current.uvIndex || 3;
  const humidity = current.humidity || 50;
  const isBn = lang === 'bn';

  const recs = [];

  // Umbrella
  if (rain > 0.2 || (weatherData.forecast?.hourly?.[0]?.precipProb > 40)) {
    recs.push({
      type: 'umbrella',
      title: isBn ? 'ছাতা সাথে রাখুন' : 'Carry an Umbrella',
      desc: isBn ? 'বৃষ্টির সম্ভাবনা রয়েছে। বাইরে বের হওয়ার সময় ছাতা বা রেইনকোট সাথে রাখুন।' : 'High precipitation probability detected today. Keep an umbrella handy.',
      icon: 'CloudRain',
      color: '#38BDF8'
    });
  } else {
    recs.push({
      type: 'umbrella',
      title: isBn ? 'ছাতার প্রয়োজন নেই' : 'No Umbrella Needed',
      desc: isBn ? 'আজ আকাশ পরিষ্কার অথবা শুষ্ক থাকবে। বৃষ্টির সম্ভাবনা কম।' : 'Dry conditions expected. Rain is unlikely for the next few hours.',
      icon: 'Sun',
      color: '#10B981'
    });
  }

  // Air Quality & Mask
  if (aqi > 150) {
    recs.push({
      type: 'mask',
      title: isBn ? 'N95 মাস্ক পরিধান করুন' : 'Wear an N95 Mask',
      desc: isBn ? `বায়ুর মান অস্বাস্থ্যকর (AQI ${aqi})। ঘরের বাইরে মাস্ক ব্যবহার অপরিহার্য।` : `Air quality is unhealthy (AQI ${aqi}). Wear a high-efficiency filtration mask outdoors.`,
      icon: 'ShieldAlert',
      color: '#EF4444'
    });
  } else if (aqi > 100) {
    recs.push({
      type: 'mask',
      title: isBn ? 'মাস্ক ব্যবহারের পরামর্শ' : 'Mask Recommended',
      desc: isBn ? 'সংবেদনশীল বা অ্যালার্জিপ্রবণ ব্যক্তিদের বাইরে মাস্ক ব্যবহারের পরামর্শ দেওয়া হচ্ছে।' : 'Sensitive groups and individuals with respiratory issues should wear a mask.',
      icon: 'ShieldCheck',
      color: '#F59E0B'
    });
  } else {
    recs.push({
      type: 'mask',
      title: isBn ? 'বায়ুর মান সন্তোষজনক' : 'Fresh Clean Air',
      desc: isBn ? 'বায়ুমণ্ডলে দূষণের মাত্রা কম। স্বাভাবিকভাবে শ্বাস-প্রশ্বাস নেওয়া নিরাপদ।' : 'Air quality index is safe. Perfect for open-air walks and fresh air ventilation.',
      icon: 'ShieldCheck',
      color: '#10B981'
    });
  }

  // UV Sunscreen
  if (uv >= 6) {
    recs.push({
      type: 'uv',
      title: isBn ? 'সানস্ক্রিন ও রোদচশমা ব্যবহার করুন' : 'Apply SPF 50+ Sunscreen',
      desc: isBn ? `ইউভি সূচক উচ্চ (${uv})। সরাসরি প্রখর রোদ এড়িয়ে চলুন এবং সানগ্লাস পরুন।` : `High UV Index (${uv}). Use broad-spectrum sunscreen, sunglasses, and seek shade midday.`,
      icon: 'Sun',
      color: '#F97316'
    });
  }

  // Hydration / Humidity
  if (temp > 30 || humidity > 75) {
    recs.push({
      type: 'hydration',
      title: isBn ? 'পর্যাপ্ত পানি ও তরল পান করুন' : 'Stay Hydrated',
      desc: isBn ? 'উচ্চ তাপমাত্রা ও আর্দ্রতার কারণে শরীর ডিহাইড্রেট হতে পারে। প্রচুর পানি পান করুন।' : 'High heat and humidity increase fluid loss. Drink plenty of water and electrolytes.',
      icon: 'Droplets',
      color: '#06B6D4'
    });
  }

  return recs;
}
