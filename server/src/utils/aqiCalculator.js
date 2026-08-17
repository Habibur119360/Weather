// AQI Breakpoints according to US EPA Standards & European Standards
// Provides calculations, status badges, colors, and health advisories.

const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    status: 'Good',
    statusBn: 'ভালো',
    category: 'good',
    color: '#10B981', // emerald green
    gradient: 'from-emerald-500 to-teal-600',
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
    color: '#F59E0B', // amber yellow
    gradient: 'from-amber-500 to-yellow-600',
    description: 'Air quality is acceptable; however, some pollutants may cause moderate health concern for sensitive individuals.',
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
    statusBn: 'সংবেদনশীল দলের জন্য অস্বাস্থ্যকর',
    category: 'sensitive',
    color: '#F97316', // orange
    gradient: 'from-orange-500 to-amber-600',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
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
    color: '#EF4444', // red
    gradient: 'from-red-500 to-rose-600',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
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
    color: '#8B5CF6', // purple
    gradient: 'from-purple-600 to-indigo-700',
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
    color: '#7F1D1D', // dark maroon / deep crimson
    gradient: 'from-rose-900 to-red-950',
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

function getAqiDetails(usAqiValue) {
  const aqi = Math.max(0, Math.min(500, Math.round(usAqiValue || 0)));
  const level = AQI_LEVELS.find(l => aqi >= l.min && aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
  
  // Calculate percentage of 500 max scale
  const percentage = Math.min(100, Math.round((aqi / 300) * 100));

  return {
    value: aqi,
    percentage,
    status: level.status,
    statusBn: level.statusBn,
    category: level.category,
    color: level.color,
    gradient: level.gradient,
    description: level.description,
    descriptionBn: level.descriptionBn,
    advice: level.advice
  };
}

// Evaluate individual pollutants (PM2.5, PM10, NO2, SO2, CO, O3)
function evaluatePollutants(currentAir) {
  const pm2_5 = currentAir.pm2_5 ?? currentAir.pm25 ?? 0;
  const pm10 = currentAir.pm10 ?? 0;
  const no2 = currentAir.nitrogen_dioxide ?? currentAir.no2 ?? 0;
  const so2 = currentAir.sulphur_dioxide ?? currentAir.so2 ?? 0;
  const co = currentAir.carbon_monoxide ?? currentAir.co ?? 0;
  const o3 = currentAir.ozone ?? currentAir.o3 ?? 0;
  const dust = currentAir.dust ?? 0;
  const uv = currentAir.uv_index ?? 0;

  const getPollutantStatus = (val, thresholds, unit = 'µg/m³') => {
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
      ...getPollutantStatus(pm2_5, { moderate: 12, unhealthy: 35.4, veryUnhealthy: 55.4, hazardous: 150.4 }),
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter',
      fullNameBn: 'সূক্ষ্ম ধূলিকণা',
      description: 'Particles <= 2.5 micrometers that penetrate deep into the lungs.'
    },
    pm10: {
      ...getPollutantStatus(pm10, { moderate: 54, unhealthy: 154, veryUnhealthy: 254, hazardous: 354 }),
      name: 'PM10',
      fullName: 'Coarse Particulate Matter',
      fullNameBn: 'মোটাতাজা ধূলিকণা',
      description: 'Inhalable particles <= 10 micrometers that irritate respiratory tracts.'
    },
    no2: {
      ...getPollutantStatus(no2, { moderate: 53, unhealthy: 100, veryUnhealthy: 360, hazardous: 649 }),
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      fullNameBn: 'নাইট্রোজেন ডাই-অক্সাইড',
      description: 'Emitted from vehicle exhausts and power plants.'
    },
    so2: {
      ...getPollutantStatus(so2, { moderate: 35, unhealthy: 75, veryUnhealthy: 185, hazardous: 304 }),
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      fullNameBn: 'সালফার ডাই-অক্সাইড',
      description: 'Produced by industrial processing and fossil fuel burning.'
    },
    co: {
      ...getPollutantStatus(co, { moderate: 4400, unhealthy: 9400, veryUnhealthy: 12400, hazardous: 15400 }),
      name: 'CO',
      fullName: 'Carbon Monoxide',
      fullNameBn: 'কার্বন মনোক্সাইড',
      description: 'Colorless, odorless toxic gas from fuel combustion.'
    },
    o3: {
      ...getPollutantStatus(o3, { moderate: 54, unhealthy: 70, veryUnhealthy: 85, hazardous: 105 }),
      name: 'O₃',
      fullName: 'Ground-level Ozone',
      fullNameBn: 'গ্রাউন্ড ওজোন গ্যাস',
      description: 'Formed by chemical reactions between oxides of nitrogen and VOCs in sunlight.'
    },
    dust: {
      ...getPollutantStatus(dust, { moderate: 50, unhealthy: 100, veryUnhealthy: 200, hazardous: 400 }),
      name: 'Dust',
      fullName: 'Atmospheric Dust',
      fullNameBn: 'বায়ুমণ্ডলীয় ধুলোবালি',
      description: 'Airborne dust concentration.'
    }
  };
}

// Humidity interpretation & comfort index
function getHumidityDetails(humidity, temperatureC) {
  const hum = Math.max(0, Math.min(100, Math.round(humidity || 0)));
  
  // Calculate approximate dew point: Td = T - ((100 - RH)/5)
  const dewPoint = Math.round((temperatureC - ((100 - hum) / 5)) * 10) / 10;
  
  let comfort = 'Comfortable';
  let comfortBn = 'আরামদায়ক';
  let color = '#10B981';
  let icon = 'Smile';
  let summary = 'Ideal humidity levels for health and comfort.';
  let summaryBn = 'স্বাস্থ্য এবং স্বাচ্ছন্দ্যের জন্য আদর্শ আর্দ্রতা মাত্রা।';

  if (hum < 30) {
    comfort = 'Dry';
    comfortBn = 'শুষ্ক';
    color = '#F59E0B';
    icon = 'Flame';
    summary = 'Air is dry. Skin may feel dry, moisturizers recommended.';
    summaryBn = 'বাতাস শুষ্ক। ত্বক আর্দ্র রাখতে ময়েশ্চারাইজার ব্যবহারের পরামর্শ।';
  } else if (hum <= 60) {
    comfort = 'Comfortable';
    comfortBn = 'আরামদায়ক ও সুষম';
    color = '#10B981';
    icon = 'Smile';
    summary = 'Optimal relative humidity for human respiratory health.';
    summaryBn = 'শ্বাস-প্রশ্বাস ও দৈনন্দিন জীবনের জন্য সবচেয়ে আরামদায়ক মাত্রা।';
  } else if (hum <= 75) {
    comfort = 'Humid';
    comfortBn = 'আর্দ্র';
    color = '#06B6D4';
    icon = 'Droplets';
    summary = 'High moisture in air, may feel slightly sticky or warm.';
    summaryBn = 'বাতাসে জলীয় বাষ্পের পরিমাণ বেশি, শরীর সামান্য ঘামতে পারে।';
  } else {
    comfort = 'Very Humid / Muggy';
    comfortBn = 'অত্যধিক আর্দ্র ও ভ্যাপসা';
    color = '#3B82F6';
    icon = 'CloudRain';
    summary = 'High moisture saturation. Feels muggy and heavy sweating.';
    summaryBn = 'অত্যধিক জলীয় বাষ্প, ভ্যাপসা গরম ও প্রচুর ঘাম অনুভূত হতে পারে।';
  }

  return {
    value: hum,
    dewPoint,
    comfort,
    comfortBn,
    color,
    icon,
    summary,
    summaryBn
  };
}

module.exports = {
  AQI_LEVELS,
  getAqiDetails,
  evaluatePollutants,
  getHumidityDetails
};
