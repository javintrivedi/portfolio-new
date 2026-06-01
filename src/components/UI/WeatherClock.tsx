'use client';

import { useEffect, useRef, useState } from 'react';

const weatherCodeMap: Record<number, string> = {
  0: 'CLEAR', 1: 'MOSTLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'OVERCAST',
  45: 'FOG', 48: 'FOG', 51: 'DRIZZLE', 53: 'DRIZZLE', 55: 'DRIZZLE',
  61: 'RAIN', 63: 'RAIN', 65: 'HEAVY RAIN',
  71: 'SNOW', 73: 'SNOW', 75: 'HEAVY SNOW',
  95: 'THUNDERSTORM', 96: 'THUNDERSTORM', 99: 'THUNDERSTORM'
};

export default function WeatherClock() {
  const timeRef = useRef<HTMLSpanElement>(null);
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

  // Clock — update DOM directly via ref, no React re-renders
  useEffect(() => {
    const updateClock = () => {
      if (!timeRef.current) return;
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      // e.g. "4:16 AM"
      const str = new Intl.DateTimeFormat('en-US', opts).format(now);
      const [timePart, ampm] = str.split(' ');
      const [hour, minute] = timePart.split(':');
      timeRef.current.innerHTML = `${hour}<span class="blink-colon">:</span>${minute} ${ampm ?? ''} JAIPUR`;
    };

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  // Weather fetch — only runs twice total (mount + refresh)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.9124&longitude=75.7873&current_weather=true');
        const data = await res.json();
        if (data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const desc = weatherCodeMap[data.current_weather.weathercode] ?? 'CLEAR';
          setWeather({ temp, desc });
        }
      } catch {
        setWeather({ temp: 32, desc: 'CLEAR' });
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--font-space-mono)',
      color: '#aaaaaa',
      fontSize: '0.8rem',
      letterSpacing: '0.1em',
      lineHeight: '1.6',
      pointerEvents: 'none'
    }}>
      {/* Colon blink done in CSS — zero JS overhead */}
      <style>{`
        @keyframes colonBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .blink-colon { animation: colonBlink 1s step-start infinite; }
      `}</style>
      <span ref={timeRef} />
      {weather && (
        <div style={{ marginTop: '0.2rem' }}>
          {weather.desc}, {weather.temp}°C
        </div>
      )}
    </div>
  );
}
