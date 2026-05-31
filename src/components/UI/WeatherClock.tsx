'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic WMO weather code mapping to text
const weatherCodeMap: Record<number, string> = {
  0: 'CLEAR',
  1: 'MOSTLY CLEAR',
  2: 'PARTLY CLOUDY',
  3: 'OVERCAST',
  45: 'FOG',
  48: 'FOG',
  51: 'DRIZZLE',
  53: 'DRIZZLE',
  55: 'DRIZZLE',
  61: 'RAIN',
  63: 'RAIN',
  65: 'HEAVY RAIN',
  71: 'SNOW',
  73: 'SNOW',
  75: 'HEAVY SNOW',
  95: 'THUNDERSTORM',
  96: 'THUNDERSTORM',
  99: 'THUNDERSTORM'
};

export default function WeatherClock() {
  const [time, setTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

  useEffect(() => {
    // Clock interval
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Blinking colon interval
    const blinkInterval = setInterval(() => {
      setShowColon((prev) => !prev);
    }, 1000); // 1s blink cycle (500ms on, 500ms off visually if we use CSS transition, but here we just toggle every 1s or 500ms)

    return () => {
      clearInterval(clockInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    // Fetch Jaipur weather from Open-Meteo (Free, no API key required)
    // Jaipur coordinates: 26.9124° N, 75.7873° E
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.9124&longitude=75.7873&current_weather=true');
        const data = await res.json();
        
        if (data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          const desc = weatherCodeMap[code] || 'CLEAR';
          
          setWeather({ temp, desc });
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        // Fallback
        setWeather({ temp: 32, desc: 'CLEAR' });
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  // Format time in IST
  // We extract parts manually to isolate the colon
  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Kolkata', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(time);
    // timeString format is typically "4:16 AM" or "12:00 PM"
    
    // Split into hour, minute, ampm
    const match = timeString.match(/^(\d+):(\d+)\s+([AM|PM]+)$/i);
    
    if (match) {
      return {
        hour: match[1],
        minute: match[2],
        ampm: match[3].toUpperCase()
      };
    }
    
    return { hour: '0', minute: '00', ampm: 'AM' };
  };

  const { hour, minute, ampm } = formatTime();

  return (
    <div style={{
      fontFamily: 'var(--font-space-mono)',
      color: '#aaaaaa',
      fontSize: '0.8rem',
      letterSpacing: '0.1em',
      lineHeight: '1.6',
      pointerEvents: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{hour}</span>
          <span style={{ 
            opacity: showColon ? 1 : 0, 
            transition: 'opacity 0.2s ease',
            margin: '0 2px'
          }}>:</span>
          <span>{minute}</span>
        </div>
        <span>{ampm}</span>
        <span>JAIPUR</span>
      </div>
      
      {weather && (
        <div style={{ marginTop: '0.2rem' }}>
          {weather.desc}, {weather.temp}°C
        </div>
      )}
    </div>
  );
}
