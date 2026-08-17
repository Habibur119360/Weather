import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  Smile,
  Compass,
  MapPin,
  Search,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';

export const WeatherConditionIcon = ({ name, className = 'w-10 h-10', isDay = true }) => {
  const iconProps = { className };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-400`} />;
    case 'SunDim':
      return <Sun {...iconProps} className={`${className} text-amber-300`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'CloudRain':
    case 'CloudRainWind':
      return <CloudRain {...iconProps} className={`${className} text-sky-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-cyan-300`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-yellow-300`} />;
    case 'CloudSnow':
    case 'Snowflake':
      return <CloudSnow {...iconProps} className={`${className} text-blue-200`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudHail':
      return <CloudHail {...iconProps} className={`${className} text-cyan-200`} />;
    default:
      return isDay ? (
        <Sun {...iconProps} className={`${className} text-amber-400`} />
      ) : (
        <Moon {...iconProps} className={`${className} text-indigo-300`} />
      );
  }
};

export {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  Smile,
  Compass,
  MapPin,
  Search,
  RefreshCw,
  Sparkles,
  Zap
};
