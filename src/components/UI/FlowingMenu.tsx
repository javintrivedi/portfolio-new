'use client';

import { useRef, useEffect, useState, startTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import './FlowingMenu.css';

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

export default function FlowingMenu({
  items = [],
  bgColor = 'transparent',
}: {
  items: MenuItemProps[];
  bgColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Duplicate items 5 times to ensure enough scrolling space
  // The middle sets will be the "true" loop track.
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items];

  useEffect(() => {
    if (containerRef.current && contentRef.current && items.length > 0) {
      const vh = window.innerHeight;
      const itemHeightPx = vh * 0.17; // 15vh height + 1vh margin top + 1vh margin bottom
      const singleSetHeight = itemHeightPx * items.length;
      
      const lenis = new Lenis({
        wrapper: containerRef.current,
        content: contentRef.current,
        lerp: 0.1,
      });
      
      // Start user at the beginning of the 3rd set
      lenis.scrollTo(singleSetHeight * 2, { immediate: true });

      // Infinite loop trick using Lenis scroll event
      lenis.on('scroll', (e: any) => {
        const scrollTop = lenis.scroll;
        
        if (scrollTop < singleSetHeight) {
          // Scrolled too far up (into the 1st set), jump down to the 3rd set
          lenis.scrollTo(scrollTop + singleSetHeight * 2, { immediate: true });
        } else if (scrollTop > singleSetHeight * 4) {
          // Scrolled too far down (into the 5th set), jump up to the 3rd set
          lenis.scrollTo(scrollTop - singleSetHeight * 2, { immediate: true });
        }
      });

      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        cancelAnimationFrame(rafId);
      };
    }
  }, [items.length]);

  return (
    <div 
      className="menu-wrap" 
      style={{ backgroundColor: bgColor, overflowY: 'auto', pointerEvents: 'auto' }}
      ref={containerRef}
    >
      {/* Hide native scrollbar but keep scrollability */}
      <style>{`
        .menu-wrap::-webkit-scrollbar { display: none; }
        .menu-wrap { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="scroll-track" ref={contentRef} style={{ position: 'relative' }}>
        {/* Top Spacer to push first item down towards the middle */}
        <div style={{ height: '30vh' }} />

        {duplicatedItems.map((item, idx) => {
          const originalIndex = idx % items.length;
          const isActive = originalIndex === activeIndex;
          
          return (
            <div 
              key={idx} 
              className="project-item"
              onMouseEnter={() => startTransition(() => setActiveIndex(originalIndex))}
              style={{
                opacity: isActive ? 1 : 0.3,
                transform: isActive ? 'scale(1)' : 'scale(0.95)',
                transformOrigin: 'left center'
              }}
            >
              <span 
                className="project-index"
                style={{ color: isActive ? '#34b7f1' : '#555555' }}
              >
                {String(originalIndex + 1).padStart(2, '0')}
              </span>
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-title"
                style={{ 
                  color: isActive ? '#ffffff' : '#555555',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                {item.text}
              </a>
            </div>
          );
        })}
        
        {/* Bottom Spacer to allow scrolling past the last item */}
        <div style={{ height: '50vh' }} />
      </div>


    </div>
  );
}
