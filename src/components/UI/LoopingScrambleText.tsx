'use client';

import { useState, useEffect } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#_';

const SENTENCES = [
  "POWERED BY CAFFEINE & FELINE CHAOS",
  "REFACTORING LIFE TO A LO-FI BEAT",
  "TURNING COFFEE INTO COMPILED CODE",
  "DEBUGGING MY SLEEP SCHEDULE",
  "CACHING MEMORIES, CLEARING BUGS",
  "ARCHITECTURE, AESTHETICS & ARPEGGIOS",
  "DESIGNING INTERFACES, PETTING CATS",
  "L'ART DU CODE, LA JOIE DE VIVRE"
];

export default function LoopingScrambleText() {
  const [displayText, setDisplayText] = useState(SENTENCES[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % SENTENCES.length;
      setCurrentIndex(nextIndex);
      
      const nextSentence = SENTENCES[nextIndex];
      let iteration = 0;
      const length = Math.max(displayText.length, nextSentence.length);
      
      const scrambleInterval = setInterval(() => {
        setDisplayText((prev) => {
          return nextSentence
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return nextSentence[index];
              }
              // While scrambling, if the current index is beyond the target string length, we just don't show it or show random chars that will be truncated
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('');
        });
        
        if (iteration >= length) {
          clearInterval(scrambleInterval);
          setDisplayText(nextSentence);
        }
        
        iteration += 1 / 2; // Decryption speed
      }, 30);
      
    }, 5000); // 5 seconds

    return () => clearInterval(cycleInterval);
  }, [currentIndex, displayText]);

  return (
    <div style={{
      fontFamily: 'var(--font-space-mono)',
      color: '#aaaaaa',
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      lineHeight: '1.6',
      pointerEvents: 'none',
      textAlign: 'right',
      maxWidth: '200px',
      whiteSpace: 'pre-wrap' // Allows wrapping for longer sentences like the reference
    }}>
      {displayText}
    </div>
  );
}
