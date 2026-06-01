'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<'initial' | 'text' | 'notes' | 'done'>('initial');
  const notesXRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  // Run the counter and notes animation via rAF — zero React re-renders
  useEffect(() => {
    if (phase !== 'notes') return;

    const startTime = performance.now();
    const duration = 3000; // 3s
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Update counter text directly
      if (percentRef.current) {
        percentRef.current.textContent = String(Math.floor(1 + progress * 99)).padStart(3, '0');
      }

      // Animate notes from right to left via transform
      if (notesXRef.current) {
        // Map progress 0→1 to translate from +100vw to -100vw
        const tx = 100 - progress * 200; // vw units
        notesXRef.current.style.transform = `translateX(${tx}vw)`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('text'), 200),
      setTimeout(() => setPhase('notes'), 1500),
      setTimeout(() => {
        setPhase('done');
        setTimeout(onComplete, 800);
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {phase === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0.2, 1, 0],
                  scale: [0.9, 1, 1, 1, 1.1],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, times: [0, 0.2, 0.4, 0.6, 1] }}
                style={{
                  fontSize: '1.5rem',
                  letterSpacing: '0.2em',
                  color: '#aaaaaa',
                  textTransform: 'uppercase',
                }}
              >
                JT
              </motion.div>
            )}

            {phase === 'notes' && (
              <div
                key="notes"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Notes row — position driven by rAF via inline style */}
                <div
                  ref={notesXRef}
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    gap: '4rem',
                    alignItems: 'center',
                    transform: 'translateX(100vw)',
                    willChange: 'transform',
                  }}
                >
                  {/* Note 1: Double Beamed Note */}
                  <div style={{ animation: 'noteFloat1 2s ease-in-out infinite' }}>
                    <svg
                      viewBox="0 0 12 12"
                      style={{
                        width: '200px',
                        height: '200px',
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(0, 170, 255, 0.5))',
                      }}
                    >
                      <path
                        d="M3 8 h3 v2 h-3 z M8 7 h3 v3 h-3 z M5 2 h1 v7 h-1 z M10 1 h1 v7 h-1 z M5 1 h6 v2 h-6 z"
                        fill="#00aaff"
                      />
                    </svg>
                  </div>

                  {/* Note 2: Quarter Note */}
                  <div style={{ animation: 'noteFloat2 2.2s ease-in-out 0.4s infinite' }}>
                    <svg
                      viewBox="0 0 12 12"
                      style={{
                        width: '150px',
                        height: '150px',
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(170, 0, 255, 0.5))',
                      }}
                    >
                      <path d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h3 v2 h-3 z" fill="#aa00ff" />
                    </svg>
                  </div>

                  {/* Note 3: Eighth Note */}
                  <div style={{ animation: 'noteFloat1 1.8s ease-in-out 0.8s infinite' }}>
                    <svg
                      viewBox="0 0 12 12"
                      style={{
                        width: '180px',
                        height: '180px',
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(255, 0, 170, 0.5))',
                      }}
                    >
                      <path
                        d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h4 v2 h-4 z M10 4 h1 v2 h-1 z M9 5 h1 v2 h-1 z"
                        fill="#ff00aa"
                      />
                    </svg>
                  </div>
                </div>

                {/* Percentage Counter — updated via DOM ref, no re-renders */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '3rem',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-space-mono)',
                    letterSpacing: '0.2em',
                    color: '#888888',
                  }}
                >
                  <span ref={percentRef}>001</span>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* CSS keyframes for note bobbing — GPU composited, no JS */}
          <style>{`
            @keyframes noteFloat1 {
              0%, 100% { transform: translateY(0); }
              25% { transform: translateY(-40px); }
              75% { transform: translateY(40px); }
            }
            @keyframes noteFloat2 {
              0%, 100% { transform: translateY(0); }
              25% { transform: translateY(-40px); }
              75% { transform: translateY(40px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
