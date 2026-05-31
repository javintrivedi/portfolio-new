'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<'initial' | 'text' | 'notes' | 'done'>('initial');
  
  // Motion value for progress from 1% to 100%
  const animProgress = useMotionValue(1);
  const xPos = useTransform(animProgress, [1, 100], ['100vw', '-100vw']);
  const [percent, setPercent] = useState(1);

  useEffect(() => {
    const unsubscribe = animProgress.on("change", (v) => {
      setPercent(Math.min(100, Math.max(1, Math.floor(v))));
    });
    return () => unsubscribe();
  }, [animProgress]);

  useEffect(() => {
    // Sequence timing
    const timers = [
      setTimeout(() => setPhase('text'), 200), // Start glitch sooner
      setTimeout(() => {
        setPhase('notes');
        // Start the progress animation from 1 to 100
        animate(animProgress, 100, { duration: 3.0, ease: 'linear' }); // Slightly faster fly-by
      }, 1500), // Start notes much earlier (1.5s instead of 3s)
      setTimeout(() => {
        setPhase('done');
        setTimeout(onComplete, 800); // Faster fade out
      }, 4500) // Total time 4.5s
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, animProgress]);

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
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            {phase === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.2, 1, 0],
                  scale: [0.9, 1, 1, 1, 1.1]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, times: [0, 0.2, 0.4, 0.6, 1] }}
                style={{
                  fontSize: '1.5rem',
                  letterSpacing: '0.2em',
                  color: '#aaaaaa',
                  textTransform: 'uppercase'
                }}
              >
                JT
              </motion.div>
            )}

            {phase === 'notes' && (
              <motion.div
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
                {/* The massive pixel-art note moving from right to left */}
                <motion.div
                  style={{
                    position: 'absolute',
                    x: xPos,
                    display: 'flex',
                    gap: '4rem',
                    alignItems: 'center'
                  }}
                >
                  {/* Note 1: Double Beamed Note */}
                  <motion.div
                    animate={{ y: [0, -40, 0, 40, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                  >
                    <svg 
                      viewBox="0 0 12 12" 
                      style={{ 
                        width: '200px', 
                        height: '200px', 
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(0, 170, 255, 0.5))'
                      }}
                    >
                      <path 
                        d="M3 8 h3 v2 h-3 z M8 7 h3 v3 h-3 z M5 2 h1 v7 h-1 z M10 1 h1 v7 h-1 z M5 1 h6 v2 h-6 z" 
                        fill="#00aaff" 
                      />
                    </svg>
                  </motion.div>

                  {/* Note 2: Quarter Note */}
                  <motion.div
                    animate={{ y: [0, -40, 0, 40, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  >
                    <svg 
                      viewBox="0 0 12 12" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(170, 0, 255, 0.5))'
                      }}
                    >
                      <path 
                        d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h3 v2 h-3 z" 
                        fill="#aa00ff" 
                      />
                    </svg>
                  </motion.div>

                  {/* Note 3: Eighth Note */}
                  <motion.div
                    animate={{ y: [0, -40, 0, 40, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  >
                    <svg 
                      viewBox="0 0 12 12" 
                      style={{ 
                        width: '180px', 
                        height: '180px', 
                        shapeRendering: 'crispEdges',
                        filter: 'drop-shadow(0 0 20px rgba(255, 0, 170, 0.5))'
                      }}
                    >
                      <path 
                        d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h4 v2 h-4 z M10 4 h1 v2 h-1 z M9 5 h1 v2 h-1 z" 
                        fill="#ff00aa" 
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Percentage Counter on the right */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '3rem',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-space-mono)',
                    letterSpacing: '0.2em',
                    color: '#888888'
                  }}
                >
                  {percent.toString().padStart(3, '0')}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
