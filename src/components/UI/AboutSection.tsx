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

    const lenis = new Lenis({ wrapper: containerRef.current, content: contentRef.current, lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const lenisTickFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTickFn);
    gsap.ticker.lagSmoothing(0);

    // Canvas wipe
    const COLS = 10, ROWS = 10, TOTAL = COLS * ROWS;
    const wipeCanvas = wipeCanvasRef.current;
    let wipeOrder: number[] | null = null;
    if (wipeCanvas) {
      wipeOrder = Array.from({ length: TOTAL }, (_, i) => i).sort(() => Math.random() - 0.5);
      const drawWipe = (progress: number) => {
        const ctx = wipeCanvas.getContext('2d');
        if (!ctx || !wipeOrder) return;
        ctx.clearRect(0, 0, wipeCanvas.width, wipeCanvas.height);
        const cellW = wipeCanvas.width / COLS, cellH = wipeCanvas.height / ROWS;
        const filled = Math.floor(progress * TOTAL);
        for (let i = 0; i < filled; i++) {
          const cell = wipeOrder[i];
          ctx.fillStyle = '#000000';
          ctx.fillRect((cell % COLS) * cellW, Math.floor(cell / COLS) * cellH, cellW + 1, cellH + 1);
        }
      };
      const resizeWipe = () => {
        if (!wipeCanvas) return;
        wipeCanvas.width = window.innerWidth;
        wipeCanvas.height = window.innerHeight;
      };
      resizeWipe();
      window.addEventListener('resize', resizeWipe);
      gsap.to({ progress: 0 }, {
        progress: 1, ease: 'none',
        scrollTrigger: { trigger: '.hero-viewport', scroller: containerRef.current, start: 'top top', end: 'bottom top', scrub: 0.5, onUpdate: (self) => drawWipe(self.progress) },
      });
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.fromTo(el, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, scroller: containerRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } });
      });
      ScrollTrigger.create({
        scroller: containerRef.current, start: 'top top', end: 'max',
        onUpdate: (self) => {
          gsap.to('#main-nav', { opacity: self.direction === 1 && self.progress > 0 ? 0 : 1, duration: 0.3, overwrite: 'auto' });
        },
      });
      gsap.to('.marquee-inner',      { xPercent: -50, ease: 'none', duration: 15, repeat: -1 });
      gsap.to('.marquee-inner-slow', { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
    }, containerRef);

    return () => {
      ctx.revert();
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden', zIndex: 40, pointerEvents: 'auto', background: 'transparent', color: '#ffffff' }}
    >
      <div ref={contentRef}>
        <canvas ref={wipeCanvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5 }} />

        {/* 1. Hero */}
        <div className="hero-viewport about-padding" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#34b7f1', letterSpacing: '0.2em', fontSize: 'clamp(0.55rem, 1.5vw, 0.8rem)', marginBottom: '1rem', fontFamily: 'var(--font-space-mono)' }}>
                / WEB DEVELOPER — SOFTWARE ENGINEERING, CLOUD, DESIGN
              </p>
              <h1 className="about-hero-name" style={{ fontFamily: 'var(--font-mango)', lineHeight: '0.8', margin: 0, textTransform: 'uppercase' }}>
                JAVIN<br />TRIVEDI
              </h1>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#aaaaaa' }}>
              <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: '#ffffff', fontWeight: 'bold' }}>2023</span><br />
              B.TECH SINCE
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#aaaaaa' }}>SCROLL</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #aaaaaa, transparent)' }} />
          </div>
        </div>

        {/* Solid Black Section */}
        <div style={{ background: '#000000', position: 'relative', zIndex: 20 }}>

          {/* 2. Floating Notes */}
          <div className="reveal-up" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1.5rem, 4vw, 4rem)', position: 'relative', zIndex: 10 }}>
            <FloatingNotes />
          </div>

          {/* 3. Statement */}
          <div className="reveal-up about-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
            <h2 className="about-statement" style={{ fontFamily: 'var(--font-mango)', lineHeight: '0.85', margin: 0, textTransform: 'uppercase' }}>
              A Software Eng<br />fueled by <span style={{ color: '#34b7f1' }}>cloud</span> &amp; <span style={{ color: '#34b7f1' }}>code</span>
            </h2>
            <div style={{ marginTop: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-space-mono)', color: '#aaaaaa', maxWidth: '600px', lineHeight: 1.8, fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
              <p style={{ marginBottom: '1rem' }}>Pursuing a B.Tech in Computer Science at SRM University, Chennai (CGPA: 9.3).</p>
              <p>I specialize in building full-stack applications, scalable cloud infrastructure, and highly engaging user interfaces.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '2rem' }}>* Whether it&apos;s AWS, Kubernetes, React, or Python — I build things that work and look great.</p>
            </div>
          </div>

          {/* 4. Experience */}
          <div className="about-padding" style={{ paddingBottom: 'clamp(4rem, 10vw, 10rem)', position: 'relative', zIndex: 10 }}>
            <div className="reveal-up" style={{ marginBottom: 'clamp(3rem, 8vw, 8rem)' }}>
              <h3 style={{ fontFamily: 'var(--font-space-mono)', color: '#34b7f1', letterSpacing: '0.2em', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
                — EXPERIENCE
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(2rem, 5vw, 4rem)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', color: '#aaaaaa', marginBottom: '1rem' }}>
                    <span>2026.01 — 2026.04</span>
                    <span style={{ color: '#34b7f1' }}>• RECENT</span>
                  </div>
                  <h4 className="about-exp-name" style={{ fontFamily: 'var(--font-mango)', margin: 0, lineHeight: 1 }}>Pachplus<br />Wellness</h4>
                  <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem', fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}>UI/UX Designer</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', color: '#aaaaaa', marginBottom: '1rem' }}>
                    <span>2025.04 — PRESENT</span>
                    <span style={{ color: '#34b7f1' }}>• ACTIVE</span>
                  </div>
                  <h4 className="about-exp-name" style={{ fontFamily: 'var(--font-mango)', margin: 0, lineHeight: 1 }}>SQAC<br />SRMIST</h4>
                  <p style={{ fontFamily: 'var(--font-space-mono)', color: '#666666', marginTop: '1.5rem', fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Corporate Lead</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="reveal-up">
              <h3 style={{ fontFamily: 'var(--font-space-mono)', color: '#34b7f1', letterSpacing: '0.2em', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
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
                  <div key={num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #333', paddingTop: 'clamp(1rem, 2.5vw, 2rem)', marginBottom: 'clamp(1rem, 2.5vw, 2rem)', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666', fontSize: 'clamp(0.65rem, 1.2vw, 1rem)', flexShrink: 0 }}>{num}</span>
                    <h4 className="about-ach-title" style={{ fontFamily: 'var(--font-mango)', margin: 0, flex: 1, marginLeft: 'clamp(1rem, 4vw, 4rem)', lineHeight: 1 }}>{title}</h4>
                    <span style={{ fontFamily: 'var(--font-space-mono)', color: '#666', fontSize: 'clamp(0.65rem, 1.2vw, 1rem)', flexShrink: 0 }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Footer */}
          <div className="reveal-up about-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '1px solid #222', background: '#050505', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.65rem, 1.5vw, 0.9rem)', color: '#34b7f1', letterSpacing: '0.2em' }}>
              <span>— GET IN TOUCH</span>
              <span>NOW ACCEPTING INQUIRIES</span>
            </div>

            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100vw', marginLeft: 'clamp(-1.5rem, -4vw, -4rem)', position: 'relative' }}>
              <div className="marquee-inner" style={{ display: 'inline-block', padding: 'clamp(2rem, 4vw, 4rem) 0' }}>
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="about-marquee" style={{ fontFamily: 'var(--font-mango)', paddingRight: 'clamp(4rem, 8vw, 10rem)', color: '#ffffff' }}>
                    {copied
                      ? <><span style={{ color: '#34b7f1' }}>Copied!</span> Copied!</>
                      : <><span style={{ color: '#34b7f1' }}>javintrivedi007</span>@gmail.com</>}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100vw', marginLeft: 'clamp(-1.5rem, -4vw, -4rem)', borderTop: '1px solid #222', borderBottom: '1px solid #222', background: '#0a0a0a' }}>
              <div className="marquee-inner-slow" style={{ display: 'inline-block', padding: '1rem 0', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', color: '#34b7f1', letterSpacing: '0.2em' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} style={{ paddingRight: '4rem' }}>
                    • TELL ME WHAT YOU&apos;RE BUILDING • REMOTE-FRIENDLY • REPLIES WITHIN 48 HOURS • TIMEZONE: LOCAL
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'clamp(2rem, 4vw, 4rem)', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={handleCopyEmail}
                style={{ background: '#34b7f1', color: '#000000', border: 'none', padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)', fontFamily: 'var(--font-space-mono)', fontWeight: 'bold', fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', cursor: 'pointer', transition: 'background 0.3s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#34b7f1')}
              >
                COPY<br />EMAIL
              </button>
              <div style={{ textAlign: 'right', fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', color: '#aaaaaa' }}>
                JAVIN TRIVEDI<br />DESIGN &amp; DEV
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
