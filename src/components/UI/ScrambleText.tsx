'use client';

import { useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
}

const CHARACTERS = '!<>-_\\/[]{}—=+*^?#_';

export default function ScrambleText({ text, isHovered }: ScrambleTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterationRef = useRef(0);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isHovered) {
      iterationRef.current = 0;
      intervalRef.current = setInterval(() => {
        if (!spanRef.current) return;
        const iteration = iterationRef.current;
        spanRef.current.textContent = text
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index];
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('');

        iterationRef.current += 1 / 3;

        if (iterationRef.current >= text.length) {
          if (spanRef.current) spanRef.current.textContent = text;
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }, 30);
    } else {
      if (spanRef.current) spanRef.current.textContent = text;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, text]);

  return <span ref={spanRef}>{text}</span>;
}
