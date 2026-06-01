'use client';

import { useEffect, useRef } from 'react';

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
  const spanRef = useRef<HTMLDivElement>(null);
  const sentenceIndexRef = useRef(0);
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (spanRef.current) spanRef.current.textContent = SENTENCES[0];

    const runScramble = (nextIndex: number) => {
      const nextSentence = SENTENCES[nextIndex];
      let iteration = 0;
      const length = nextSentence.length;

      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);

      scrambleIntervalRef.current = setInterval(() => {
        if (!spanRef.current) return;
        spanRef.current.textContent = nextSentence
          .split('')
          .map((_, index) => {
            if (index < iteration) return nextSentence[index];
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('');

        iteration += 0.5;

        if (iteration >= length) {
          if (spanRef.current) spanRef.current.textContent = nextSentence;
          clearInterval(scrambleIntervalRef.current!);
          scrambleIntervalRef.current = null;
        }
      }, 30);
    };

    const schedule = () => {
      cycleTimeoutRef.current = setTimeout(() => {
        sentenceIndexRef.current = (sentenceIndexRef.current + 1) % SENTENCES.length;
        runScramble(sentenceIndexRef.current);
        schedule();
      }, 5000);
    };

    schedule();

    return () => {
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    };
  }, []); // Empty deps — runs once, uses refs for state

  return (
    <div
      ref={spanRef}
      style={{
        fontFamily: 'var(--font-space-mono)',
        color: '#aaaaaa',
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        lineHeight: '1.6',
        pointerEvents: 'none',
        textAlign: 'right',
        maxWidth: '200px',
        whiteSpace: 'pre-wrap'
      }}
    />
  );
}
