'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
}

const CHARACTERS = '!<>-_\\/[]{}—=+*^?#_';

export default function ScrambleText({ text, isHovered }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | null>(null);
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);
  const frameCounterRef = useRef(0);

  useEffect(() => {
    if (isHovered) {
      // Scramble on hover
      let iteration = 0;
      const length = text.length;
      
      const interval = setInterval(() => {
        setDisplayText((prev) => {
          return prev
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('');
        });
        
        if (iteration >= length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3; // Controls speed of decryption
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      // Return to original instantly when mouse leaves
      setDisplayText(text);
    }
  }, [isHovered, text]);

  return <>{displayText}</>;
}
