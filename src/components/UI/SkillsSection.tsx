'use client';

import { useEffect, useRef, useState, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Python', 'C', 'C++', 'JavaScript', 'Swift', 'HTML5', 'CSS3', 'SQL']
  },
  {
    title: 'DevOps & Cloud',
    skills: ['Terraform', 'Ansible', 'Docker', 'Kubernetes', 'AWS', 'GitHub Actions']
  },
  {
    title: 'Frameworks',
    skills: ['Flask', 'SwiftUI', 'UIKit', 'Prometheus', 'Grafana', 'Vercel']
  },
  {
    title: 'Libraries & AI',
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'ResNet50', 'VGG16', 'CNNs']
  }
];

export default function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [openCategories, setOpenCategories] = useState<number[]>([0]); // First one open by default

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Initialize Lenis
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      lerp: 0.1, // Smoothness multiplier
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
  }, []);

  const toggleCategory = (index: number) => {
    startTransition(() => {
      setOpenCategories(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 40,
        pointerEvents: 'auto',
        background: 'transparent',
        color: '#ffffff'
      }}
    >
      <div ref={contentRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Translucent Background to match the projects tab */}
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, 
          width: '100%', height: '100%', 
          background: 'rgba(0, 0, 0, 0.75)', 
          backdropFilter: 'blur(8px)',
          zIndex: -1 
        }} />

        {/* Two Column Layout Wrapper */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          width: '100%', 
          maxWidth: '1800px', 
          margin: '0 auto',
          position: 'relative' 
        }}>
          
          {/* LEFT COLUMN - STICKY */}
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '50%',
            padding: '8rem 4rem 4rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ 
                fontFamily: 'var(--font-space-mono)', 
                color: '#aaaaaa', 
                marginBottom: '2rem' 
              }}>
                Skills
              </p>
              <h1 style={{
                fontFamily: 'var(--font-mango)',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: '1.1',
                textTransform: 'uppercase',
                margin: 0
              }}>
                Computer Science student at SRM University, specialized in cloud architecture, passionate about web development and design.
              </h1>
            </div>

            <a 
              href="mailto:javintrivedi007@gmail.com"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.9rem',
                color: '#ffffff',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              CONTACT ME <span style={{ color: '#34b7f1' }}>+</span>
            </a>
          </div>

          {/* RIGHT COLUMN - SCROLLING */}
          <div style={{
            width: '50%',
            padding: '12rem 4rem 12rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem'
          }}>
            {skillCategories.map((category, idx) => {
              const isOpen = openCategories.includes(idx);
              
              return (
                <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem' }}>
                  <button 
                    onClick={() => toggleCategory(idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '1rem 0'
                    }}
                  >
                    <h2 style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                      margin: 0,
                      fontWeight: 'normal'
                    }}>
                      {category.title}
                    </h2>
                    <span style={{ 
                      fontSize: '2rem', 
                      color: '#aaaaaa',
                      fontFamily: 'var(--font-space-mono)',
                      fontWeight: 'lighter'
                    }}>
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {category.skills.map((skill, sIdx) => (
                            <div key={sIdx} style={{
                              fontFamily: 'var(--font-space-mono)',
                              color: '#888888',
                              fontSize: '1.1rem',
                              transition: 'color 0.3s ease',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888888'}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
