'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import FloatingNotes from './FloatingNotes';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  
  // 20x20 grid for the pixel wipe (400 blocks)
  const pixelGrid = Array.from({ length: 400 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current || !contentRef.current) return;

    // Initialize Lenis
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      lerp: 0.1, // Smoothness multiplier
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Setup scroll animations for sections
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              scroller: containerRef.current, // Tell GSAP to listen to this div, not window
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
      
      // Pixel Wipe Animation (No pinning, completely smooth scroll)
      gsap.to('.wipe-pixel', {
        opacity: 1,
        stagger: {
          amount: 1, 
          from: "random"
        },
        scrollTrigger: {
          trigger: '.hero-viewport',
          scroller: containerRef.current,
          start: 'top top',
          end: 'bottom top', // Transition happens exactly as the Hero section scrolls out
          scrub: 0.5, 
        }
      });

      // Navbar Auto-Hide on Scroll Direction
      ScrollTrigger.create({
        scroller: containerRef.current,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          // self.direction 1 is down, -1 is up
          if (self.direction === 1 && self.progress > 0) {
            gsap.to('#main-nav', { opacity: 0, duration: 0.3, overwrite: "auto" });
          } else {
            gsap.to('#main-nav', { opacity: 1, duration: 0.3, overwrite: "auto" });
          }
        }
      });
      
      // Horizontal Marquee Animation
      gsap.to('.marquee-inner', {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1
      });
      
      gsap.to('.marquee-inner-slow', {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1
      });

    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
      lenis.destroy();
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('javintrivedi007@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
        zIndex: 40, // Below the overlay nav (100) but above canvas
        pointerEvents: 'auto',
        background: 'transparent', // Let the 3D scene show through
        color: '#ffffff'
      }}
    >
      <div ref={contentRef}>
      {/* Fixed Background Pixel Grid */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gridTemplateRows: 'repeat(20, 1fr)', pointerEvents: 'none', zIndex: 5 }}>
        {pixelGrid.map((_, i) => (
          <div key={`wipe-${i}`} className="wipe-pixel" style={{ background: '#000000', opacity: 0, width: '100%', height: '100%' }} />
        ))}
      </div>

      {/* 1. Hero Viewport */}
      <div className="hero-viewport" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <div>
            <p style={{ color: '#34b7f1', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'var(--font-space-mono)' }}>
              / WEB DEVELOPER — SOFTWARE ENGINEERING, CLOUD, DESIGN
            </p>
            <h1 style={{ fontFamily: 'var(--font-mango)', fontSize: 'clamp(6rem, 15vw, 15rem)', lineHeight: '0.8', margin: 0, textTransform: 'uppercase' }}>
              JAVIN<br/>TRIVEDI
            </h1>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: '0.9rem', color: '#aaaaaa' }}>
            <span style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 'bold' }}>2023</span><br/>
            B.TECH SINCE
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#aaaaaa' }}>SCROLL</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #aaaaaa, transparent)' }} />
        </div>
      </div>

      {/* Solid Black Section for everything below Hero */}
      <div style={{ background: '#000000', position: 'relative', zIndex: 20 }}>
        
        {/* 2. Floating Notes Viewport */}
        <div className="reveal-up" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', position: 'relative', zIndex: 10 }}>
          <FloatingNotes />
        </div>

      {/* 3. Statement Viewport */}
      <div className="reveal-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-mango)', fontSize: '15vw', lineHeight: '0.85', margin: 0, textTransform: 'uppercase' }}>
          A Software Eng<br/>fueled by <span style={{ color: '#34b7f1' }}>cloud</span> & <span style={{ color: '#34b7f1' }}>code</span>
        </h2>
        <div style={{ marginTop: '4rem', fontFamily: 'var(--font-space-mono)', color: '#aaaaaa', maxWidth: '600px', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '1rem' }}>Pursuing a B.Tech in Computer Science at SRM University, Chennai (CGPA: 9.3).</p>
          <p>I specialize in building full-stack applications, scalable cloud infrastructure, and highly engaging user interfaces.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '2rem' }}>* Whether it's AWS, Kubernetes, React, or Python — I build things that work and look great.</p>
        </div>
      </div>

      {/* 4. Experience Viewport */}
      <div style={{ padding: '4rem', paddingBottom: '10rem', position: 'relative', zIndex: 10 }}>
        {/* Current */}
        <div className="reveal-up" style={{ marginBottom: '8rem' }}>
          <h3 style={{ fontFamily: 'var(--font-space-mono)', color: '#34b7f1', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '4rem' }}>
            — EXPERIENCE
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#aaaaaa', marginBottom: '1rem' }}>
                <span>2026.01 — 2026.04</span>
                <span style={{ color: '#34b7f1' }}>• RECENT</span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '5rem', margin: 0, lineHeight: 1 }}>Pachplus<br/>Wellness</h4>
              <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem' }}>UI/UX Designer</p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#aaaaaa', marginBottom: '1rem' }}>
                <span>2025.04 — PRESENT</span>
                <span style={{ color: '#34b7f1' }}>• ACTIVE</span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '5rem', margin: 0, lineHeight: 1 }}>SQAC<br/>SRMIST</h4>
              <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem' }}>Corporate Lead</p>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="reveal-up">
          <h3 style={{ fontFamily: 'var(--font-space-mono)', color: '#34b7f1', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '4rem' }}>
            — ACHIEVEMENTS & CERTS
          </h3>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>01</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>Designathon 2025 Finalist</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Nat'l</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>02</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>AWS Developer Associate</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Cert</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>03</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>Oracle Fusion Cloud ERP</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Cert</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>04</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>Oracle Foundations Associate</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Cert</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>05</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>Gen AI with AWS (Udacity)</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Cert</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>06</span>
              <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>Institution of Engineers (India)</h4>
              <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>Mem.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer / Get In Touch */}
      <div className="reveal-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4rem', borderTop: '1px solid #222', background: '#050505', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: '0.9rem', color: '#34b7f1', letterSpacing: '0.2em' }}>
          <span>— GET IN TOUCH</span>
          <span>NOW ACCEPTING INQUIRIES</span>
        </div>

        {/* Massive Marquee */}
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100vw', marginLeft: '-4rem', position: 'relative' }}>
          <div className="marquee-inner" style={{ display: 'inline-block', padding: '4rem 0' }}>
            {/* Repeat content multiple times for seamless loop */}
            {[1, 2, 3, 4].map((i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mango)', fontSize: '20vw', paddingRight: '10rem', color: '#ffffff' }}>
                {copied ? (
                  <>
                    <span style={{ color: '#34b7f1' }}>Copied!</span> Copied!
                  </>
                ) : (
                  <>
                    <span style={{ color: '#34b7f1' }}>javintrivedi007</span>@gmail.com
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Status Marquee */}
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100vw', marginLeft: '-4rem', borderTop: '1px solid #222', borderBottom: '1px solid #222', background: '#0a0a0a' }}>
          <div className="marquee-inner-slow" style={{ display: 'inline-block', padding: '1rem 0', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#34b7f1', letterSpacing: '0.2em' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} style={{ paddingRight: '4rem' }}>
                • TELL ME WHAT YOU'RE BUILDING • REMOTE-FRIENDLY • REPLIES WITHIN 48 HOURS • TIMEZONE: LOCAL
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4rem' }}>
          <button 
            onClick={handleCopyEmail}
            style={{ 
              background: '#34b7f1', 
              color: '#000000', 
              border: 'none', 
              padding: '1rem 2rem', 
              fontFamily: 'var(--font-space-mono)', 
              fontWeight: 'bold', 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#34b7f1'}
          >
            COPY<br/>EMAIL
          </button>
          
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#aaaaaa' }}>
            JAVIN TRIVEDI<br/>DESIGN & DEV
          </div>
        </div>

      </div>
      {/* End Solid Black Section */}
      </div>
      </div>
    </motion.div>
  );
}
