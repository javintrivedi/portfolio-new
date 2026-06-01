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
  const wipeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      lerp: 0.1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // ✅ Store function reference so we can ACTUALLY remove it from the ticker
    const lenisTickFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTickFn);
    gsap.ticker.lagSmoothing(0);

    // Canvas-based pixel wipe — 100 cells (10×10) on a <canvas> instead of 400 DOM divs
    const COLS = 10;
    const ROWS = 10;
    const TOTAL = COLS * ROWS;
    const wipeCanvas = wipeCanvasRef.current;
    let wipeOpacities: Float32Array | null = null;
    let wipeOrder: number[] | null = null;
    let wipeRaf: number | null = null;

    if (wipeCanvas) {
      wipeOpacities = new Float32Array(TOTAL); // all 0
      // Pre-shuffle the cell draw order (random stagger)
      wipeOrder = Array.from({ length: TOTAL }, (_, i) => i).sort(() => Math.random() - 0.5);

      const drawWipe = (progress: number) => {
        const ctx = wipeCanvas.getContext('2d');
        if (!ctx || !wipeOpacities || !wipeOrder) return;
        ctx.clearRect(0, 0, wipeCanvas.width, wipeCanvas.height);
        const cellW = wipeCanvas.width / COLS;
        const cellH = wipeCanvas.height / ROWS;
        const filled = Math.floor(progress * TOTAL);

        for (let i = 0; i < filled; i++) {
          const cell = wipeOrder[i];
          const col = cell % COLS;
          const row = Math.floor(cell / COLS);
          ctx.fillStyle = '#000000';
          ctx.fillRect(col * cellW, row * cellH, cellW + 1, cellH + 1);
        }
      };

      const resizeWipe = () => {
        if (!wipeCanvas) return;
        wipeCanvas.width = window.innerWidth;
        wipeCanvas.height = window.innerHeight;
      };
      resizeWipe();
      window.addEventListener('resize', resizeWipe);

      // Drive the wipe from scroll progress
      const wipeProxy = { progress: 0 };
      gsap.to(wipeProxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-viewport',
          scroller: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => drawWipe(self.progress),
        },
      });
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              scroller: containerRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Navbar Auto-Hide on Scroll Direction
      ScrollTrigger.create({
        scroller: containerRef.current,
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          if (self.direction === 1 && self.progress > 0) {
            gsap.to('#main-nav', { opacity: 0, duration: 0.3, overwrite: 'auto' });
          } else {
            gsap.to('#main-nav', { opacity: 1, duration: 0.3, overwrite: 'auto' });
          }
        },
      });

      // Marquee — CSS transform driven, smooth
      gsap.to('.marquee-inner', {
        xPercent: -50,
        ease: 'none',
        duration: 15,
        repeat: -1,
      });

      gsap.to('.marquee-inner-slow', {
        xPercent: -50,
        ease: 'none',
        duration: 30,
        repeat: -1,
      });
    }, containerRef);

    return () => {
      ctx.revert();
      // ✅ Remove the exact same function reference — previously a new arrow fn was passed, which is a no-op
      gsap.ticker.remove(lenisTickFn);
      ScrollTrigger.getAll().forEach(t => t.kill());
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
        zIndex: 40,
        pointerEvents: 'auto',
        background: 'transparent',
        color: '#ffffff',
      }}
    >
      <div ref={contentRef}>
        {/* Canvas-based pixel wipe — single GPU-composited element instead of 400 divs */}
        <canvas
          ref={wipeCanvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        {/* 1. Hero Viewport */}
        <div className="hero-viewport" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <div>
              <p style={{ color: '#34b7f1', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'var(--font-space-mono)' }}>
                / WEB DEVELOPER — SOFTWARE ENGINEERING, CLOUD, DESIGN
              </p>
              <h1 style={{ fontFamily: 'var(--font-mango)', fontSize: 'clamp(6rem, 15vw, 15rem)', lineHeight: '0.8', margin: 0, textTransform: 'uppercase' }}>
                JAVIN<br />TRIVEDI
              </h1>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: '0.9rem', color: '#aaaaaa' }}>
              <span style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 'bold' }}>2023</span><br />
              B.TECH SINCE
            </div>
          </div>

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
              A Software Eng<br />fueled by <span style={{ color: '#34b7f1' }}>cloud</span> &amp; <span style={{ color: '#34b7f1' }}>code</span>
            </h2>
            <div style={{ marginTop: '4rem', fontFamily: 'var(--font-space-mono)', color: '#aaaaaa', maxWidth: '600px', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '1rem' }}>Pursuing a B.Tech in Computer Science at SRM University, Chennai (CGPA: 9.3).</p>
              <p>I specialize in building full-stack applications, scalable cloud infrastructure, and highly engaging user interfaces.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '2rem' }}>* Whether it&apos;s AWS, Kubernetes, React, or Python — I build things that work and look great.</p>
            </div>
          </div>

          {/* 4. Experience Viewport */}
          <div style={{ padding: '4rem', paddingBottom: '10rem', position: 'relative', zIndex: 10 }}>
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
                  <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '5rem', margin: 0, lineHeight: 1 }}>Pachplus<br />Wellness</h4>
                  <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem' }}>UI/UX Designer</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#aaaaaa', marginBottom: '1rem' }}>
                    <span>2025.04 — PRESENT</span>
                    <span style={{ color: '#34b7f1' }}>• ACTIVE</span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '5rem', margin: 0, lineHeight: 1 }}>SQAC<br />SRMIST</h4>
                  <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem' }}>Corporate Lead</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="reveal-up">
              <h3 style={{ fontFamily: 'var(--font-space-mono)', color: '#34b7f1', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '4rem' }}>
                — ACHIEVEMENTS &amp; CERTS
              </h3>
              <div>
                {[
                  ['01', 'Designathon 2025 Finalist', "Nat'l"],
                  ['02', 'AWS Developer Associate', 'Cert'],
                  ['03', 'Oracle Fusion Cloud ERP', 'Cert'],
                  ['04', 'Oracle Foundations Associate', 'Cert'],
                  ['05', 'Gen AI with AWS (Udacity)', 'Cert'],
                  ['06', 'Institution of Engineers (India)', 'Mem.'],
                  ['07', 'GitHub Copilot GH-300', 'Global'],
                ].map(([num, title, tag]) => (
                  <div key={num} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
                    <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>{num}</span>
                    <h4 style={{ fontFamily: 'var(--font-mango)', fontSize: '3.5rem', margin: 0, flex: 1, marginLeft: '4rem', lineHeight: 1 }}>{title}</h4>
                    <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666' }}>{tag}</span>
                  </div>
                ))}
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
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} style={{ fontFamily: 'var(--font-mango)', fontSize: '20vw', paddingRight: '10rem', color: '#ffffff' }}>
                    {copied ? (
                      <><span style={{ color: '#34b7f1' }}>Copied!</span> Copied!</>
                    ) : (
                      <><span style={{ color: '#34b7f1' }}>javintrivedi007</span>@gmail.com</>
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
                    • TELL ME WHAT YOU&apos;RE BUILDING • REMOTE-FRIENDLY • REPLIES WITHIN 48 HOURS • TIMEZONE: LOCAL
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
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#34b7f1')}
              >
                COPY<br />EMAIL
              </button>

              <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: '#aaaaaa' }}>
                JAVIN TRIVEDI<br />DESIGN &amp; DEV
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
