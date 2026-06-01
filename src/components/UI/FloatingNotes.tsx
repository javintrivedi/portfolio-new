'use client';

import { useRef, useCallback, useEffect } from 'react';

const NOTE_CHARS = ['♪', '♫', '♩', '♬'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  rotation: number; rotationSpeed: number;
  size: number;
  color: string;
  char: string;
}

// ---------------------------------------------------------------------------
// Guitar strum synthesis via Web Audio API
// Each "chord" is a set of frequencies (guitar string pitches) staggered
// in time to simulate the pick sweeping across the strings.
// ---------------------------------------------------------------------------
const CHORDS: Record<string, number[]> = {
  '#00aaff': [110.00, 164.81, 220.00, 261.63, 329.63],        // Am — blue
  '#aa00ff': [82.41, 123.47, 164.81, 196.00, 246.94, 329.63], // Em — purple
  '#ff00aa': [146.83, 220.00, 293.66, 369.99],                 // D  — pink
};

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playGuitarStrum(color: string) {
  const freqs = CHORDS[color];
  if (!freqs) return;

  try {
    const ctx = getAudioCtx();

    // Master gain — keeps overall volume comfortable
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.18, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

    // Body resonance — bandpass filter simulates guitar soundhole
    const body = ctx.createBiquadFilter();
    body.type = 'bandpass';
    body.frequency.value = 800;
    body.Q.value = 0.7;

    // Slight reverb via a short convolver-free delay chain
    const delay = ctx.createDelay(0.08);
    delay.delayTime.value = 0.06;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.15;
    delay.connect(delayGain);
    delayGain.connect(master);

    body.connect(master);
    body.connect(delay);
    master.connect(ctx.destination);

    // Strum: each string starts ~22ms after the previous one (pick sweep)
    freqs.forEach((freq, i) => {
      const strumOffset = i * 0.022;

      // Primary oscillator — slightly detuned sawtooth for warmth
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + strumOffset);
      // Slight pitch drop to simulate string tension release
      osc.frequency.exponentialRampToValueAtTime(freq * 0.995, ctx.currentTime + strumOffset + 0.1);

      // Harmonic (one octave up, lower volume) — adds brightness
      const harmonic = ctx.createOscillator();
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime + strumOffset);

      // Per-string envelope: sharp pluck attack, slow decay
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime + strumOffset);
      env.gain.linearRampToValueAtTime(0.55, ctx.currentTime + strumOffset + 0.008); // attack
      env.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + strumOffset + 0.15); // decay
      env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + strumOffset + 1.8); // release

      const harmGain = ctx.createGain();
      harmGain.gain.value = 0.12;

      osc.connect(env);
      harmonic.connect(harmGain);
      harmGain.connect(env);
      env.connect(body);

      osc.start(ctx.currentTime + strumOffset);
      osc.stop(ctx.currentTime + strumOffset + 2.0);
      harmonic.start(ctx.currentTime + strumOffset);
      harmonic.stop(ctx.currentTime + strumOffset + 2.0);
    });
  } catch (e) {
    // Silently ignore if audio isn't available
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function FloatingNotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.015);

    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.vx *= 0.97;
      p.alpha -= 0.016;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.font = `bold ${p.size}px serif`;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(runLoop);
    } else {
      rafRef.current = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const spawnBurst = useCallback((clientX: number, clientY: number, color: string) => {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 3 + Math.random() * 6;
      particlesRef.current.push({
        x: clientX, y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        size: 16 + Math.random() * 20,
        color,
        char: NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)],
      });
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(runLoop);
    }
  }, [runLoop]);

  const handleClick = useCallback((e: React.MouseEvent, color: string) => {
    playGuitarStrum(color);
    spawnBurst(e.clientX, e.clientY, color);
  }, [spawnBurst]);

  return (
    <div className="note-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes noteFloat {
          0%, 100% { transform: translateY(0px); }
          25%       { transform: translateY(-40px); }
          75%       { transform: translateY(40px); }
        }
        .floating-note {
          cursor: pointer;
          transition: filter 0.15s ease;
          user-select: none;
        }
        .floating-note:hover  { filter: brightness(1.4); }
        .floating-note:active { filter: brightness(2); transform: scale(0.93); }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 200 }} />

      {/* Note 1 — Am — blue */}
      <div className="floating-note" style={{ animation: 'noteFloat 4s ease-in-out infinite' }} onClick={(e) => handleClick(e, '#00aaff')}>
        <svg viewBox="0 0 12 12" className="note-svg-lg" style={{ shapeRendering: 'crispEdges', filter: 'drop-shadow(-20px 20px 0 rgba(0,170,255,0.2))' }}>
          <path d="M3 8 h3 v2 h-3 z M8 7 h3 v3 h-3 z M5 2 h1 v7 h-1 z M10 1 h1 v7 h-1 z M5 1 h6 v2 h-6 z" fill="#00aaff" />
        </svg>
      </div>

      {/* Note 2 — Em — purple */}
      <div className="floating-note" style={{ animation: 'noteFloat 4.5s ease-in-out 0.5s infinite' }} onClick={(e) => handleClick(e, '#aa00ff')}>
        <svg viewBox="0 0 12 12" className="note-svg-md" style={{ shapeRendering: 'crispEdges', filter: 'drop-shadow(-20px 20px 0 rgba(170,0,255,0.2))' }}>
          <path d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h3 v2 h-3 z" fill="#aa00ff" />
        </svg>
      </div>

      {/* Note 3 — D — pink */}
      <div className="floating-note" style={{ animation: 'noteFloat 5s ease-in-out 1s infinite' }} onClick={(e) => handleClick(e, '#ff00aa')}>
        <svg viewBox="0 0 12 12" className="note-svg-sm" style={{ shapeRendering: 'crispEdges', filter: 'drop-shadow(-20px 20px 0 rgba(255,0,170,0.2))' }}>
          <path d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h4 v2 h-4 z M10 4 h1 v2 h-1 z M9 5 h1 v2 h-1 z" fill="#ff00aa" />
        </svg>
      </div>
    </div>
  );
}
