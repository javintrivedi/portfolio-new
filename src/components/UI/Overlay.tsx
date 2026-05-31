'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData, SectionId } from '@/data/portfolio';
import { useState, startTransition } from 'react';
import ScrambleText from './ScrambleText';
import FlowingMenu from './FlowingMenu';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import WeatherClock from './WeatherClock';
import LoopingScrambleText from './LoopingScrambleText';

const projectItems = [
  { link: 'https://github.com/javintrivedi/campus-compass-main', text: 'Campus Compass', image: 'https://opengraph.githubassets.com/1/javintrivedi/campus-compass-main' },
  { link: 'https://github.com/javintrivedi/EchoSaath', text: 'EchoSaath', image: 'https://opengraph.githubassets.com/1/javintrivedi/EchoSaath' },
  { link: 'https://advikcreations.in/', text: 'Advik Creations', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' },
  { link: 'https://github.com/javintrivedi/Lung-Cancer-Prediction-using-multiple-ML-models', text: 'Lung Cancer Prediction', image: 'https://opengraph.githubassets.com/1/javintrivedi/Lung-Cancer-Prediction-using-multiple-ML-models' },
  { link: 'https://github.com/javintrivedi/Hospital-Management-System', text: 'Hospital Management System', image: 'https://opengraph.githubassets.com/1/javintrivedi/Hospital-Management-System' },
  { link: 'https://github.com/javintrivedi/KickStart', text: 'KickStart', image: 'https://opengraph.githubassets.com/1/javintrivedi/KickStart' },
  { link: 'https://github.com/javintrivedi/HackMate', text: 'HackMate', image: 'https://opengraph.githubassets.com/1/javintrivedi/HackMate' }
];

interface OverlayProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  visitedCount: number;
  isEasterEggActive: boolean;
  setIsEasterEggActive: (active: boolean) => void;
}

export default function Overlay({ activeSection, setActiveSection, visitedCount, isEasterEggActive, setIsEasterEggActive }: OverlayProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const activeData = activeSection ? portfolioData[activeSection] : null;
  const handleNavClick = (id: SectionId) => {
    // Close contact dropdown if open
    setContactOpen(false);
    
    // Only set active section if it's different to allow toggling off
    if (activeSection === id) {
      setActiveSection(null);
    } else {
      setActiveSection(id);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, left: 0, 
      width: '100%', height: '100%', 
      pointerEvents: 'none', 
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem',
      color: '#ffffff'
    }}>
      {/* Top Navigation Bar */}
      <nav id="main-nav" style={{ 
        position: 'absolute', 
        top: '2rem', 
        left: '2rem', 
        right: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        pointerEvents: 'none', 
        zIndex: 100 
      }}>
        {/* Left Side */}
        <div style={{ display: 'flex', gap: '2rem', pointerEvents: 'auto', flex: 1 }}>
          <NavButton id="about" label="ABOUT" activeSection={activeSection} onClick={() => handleNavClick('about')} />
          <NavButton id="skills" label="SKILLS" activeSection={activeSection} onClick={() => handleNavClick('skills')} />
        </div>

        {/* Center Logo */}
        <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center', flex: 1 }}>
          <button
            onClick={() => setActiveSection(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1.5rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'text-shadow 0.3s ease',
              fontFamily: 'var(--font-space-mono)',
              textShadow: '0 0 10px rgba(255,255,255,0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textShadow = '0 0 20px rgba(255,255,255,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.2)'}
          >
            JT
          </button>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', gap: '2rem', pointerEvents: 'auto', flex: 1, justifyContent: 'flex-end', position: 'relative' }}>
          <NavButton id="projects" label="PROJECTS" activeSection={activeSection} onClick={() => handleNavClick('projects')} />
          
          <div style={{ position: 'relative' }}>
            <NavButton 
              id={"contact" as any} 
              label="CONTACT" 
              activeSection={contactOpen ? 'contact' as any : activeSection} 
              onClick={() => startTransition(() => setContactOpen(!contactOpen))} 
            />
            
            <AnimatePresence>
              {contactOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    pointerEvents: 'auto'
                  }}
                >
                  <HoverLink href="https://github.com/javintrivedi/" text="GITHUB" />
                  <HoverLink href="https://www.linkedin.com/in/javintrivedi/" text="LINKEDIN" />
                  <HoverLink href="https://www.instagram.com/javintrivedi/" text="INSTAGRAM" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Middle Left Weather Clock Widget */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'absolute', top: '45%', left: '2rem', transform: 'translateY(-50%)', pointerEvents: 'auto', zIndex: 100 }}
          >
            <WeatherClock />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Middle Right Scramble Text Widget */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'absolute', top: '45%', right: '2rem', transform: 'translateY(-50%)', pointerEvents: 'auto', zIndex: 100 }}
          >
            <LoopingScrambleText />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main style={{ pointerEvents: 'none', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {activeData?.id === 'projects' ? (
            <motion.div
              key="projects-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              style={{
                pointerEvents: 'auto',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 50,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* FlowingMenu is transparent so you can see the 3D scene through it */}
              <FlowingMenu items={projectItems} bgColor="transparent" />
            </motion.div>
          ) : activeData?.id === 'about' ? (
            <AboutSection key="about-section" />
          ) : activeData?.id === 'skills' ? (
            <SkillsSection key="skills-section" />
          ) : activeData ? (
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(16px)',
                borderLeft: `4px solid ${activeData.color}`,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2.5rem',
                borderRadius: '0 16px 16px 0',
                maxWidth: '500px',
                boxShadow: `0 0 30px ${activeData.color}22`,
                marginLeft: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', color: activeData.color }}>{activeData.title}</h2>
                <button 
                  onClick={() => setActiveSection(null)}
                  style={{ 
                    background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', fontSize: '1.5rem' 
                  }}
                >
                  &times;
                </button>
              </div>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#aaaaaa', fontWeight: 'normal' }}>
                {activeData.description}
              </h3>
              
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {activeData.content.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    style={{ marginBottom: '0.8rem', lineHeight: 1.6, color: '#dddddd' }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>



      {/* Resume Link (Bottom Left) */}
      <AnimatePresence>
        {!activeSection && (
          <motion.a
            href="https://drive.google.com/file/d/1bU1RqDKhFV2hCESC_FIwCPx8EASb7NZd/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              pointerEvents: 'auto',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.8rem',
              color: '#aaaaaa',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
          >
            <span style={{ color: '#34b7f1' }}>↓</span> RESUME
          </motion.a>
        )}
      </AnimatePresence>

      {/* Social Icons */}
      <AnimatePresence>
        {!activeSection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '1.5rem', pointerEvents: 'auto', zIndex: 100 }}
          >
            <a href="https://www.instagram.com/javintrivedi/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaaaaa', transition: 'color 0.3s ease', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.linkedin.com/in/javintrivedi/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaaaaa', transition: 'color 0.3s ease', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://github.com/javintrivedi/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaaaaa', transition: 'color 0.3s ease', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ id, label, activeSection, onClick }: { id: SectionId, label: string, activeSection: SectionId, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isActive = activeSection === id;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: isActive || hovered ? '#ffffff' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'color 0.3s ease',
        textShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
      }}
    >
      <ScrambleText text={label} isHovered={hovered && !isActive} />
    </button>
  );
}

function HoverLink({ href, text }: { href: string; text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#ffffff' : 'rgba(255,255,255,0.4)',
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        textShadow: hovered ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
        whiteSpace: 'nowrap'
      }}
    >
      <ScrambleText text={text} isHovered={hovered} />
    </a>
  );
}
