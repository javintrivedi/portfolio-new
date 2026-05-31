'use client';

import { useState, startTransition } from 'react';
import Scene from '@/components/Canvas/Scene';
import Overlay from '@/components/UI/Overlay';
import Loader from '@/components/UI/Loader';
import { SectionId } from '@/data/portfolio';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [activeSection, setActiveSectionState] = useState<SectionId>(null);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setActiveSection = (id: SectionId) => {
    startTransition(() => {
      setActiveSectionState(id);
      if (id) {
        setVisitedSections((prev) => new Set(prev).add(id));
      }
    });
  };
  const onGuideClick = () => {
    // List of all sections
    const allSections = ['about', 'skills', 'projects', 'experience'];
    // Filter out visited ones
    const unvisited = allSections.filter(sec => !visitedSections.has(sec));
    
    if (unvisited.length > 0) {
      // Pick a random unvisited section
      const randomSection = unvisited[Math.floor(Math.random() * unvisited.length)];
      setActiveSection(randomSection as SectionId);
    } else {
      // If all visited, just pick a random one
      const randomSection = allSections[Math.floor(Math.random() * allSections.length)];
      setActiveSection(randomSection as SectionId);
    }
  };

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000000' }}>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Scene 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
              visitedCount={visitedSections.size}
              isEasterEggActive={isEasterEggActive} 
              onGuideClick={onGuideClick}
            />
            <Overlay 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
              visitedCount={visitedSections.size}
              isEasterEggActive={isEasterEggActive}
              setIsEasterEggActive={setIsEasterEggActive}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
