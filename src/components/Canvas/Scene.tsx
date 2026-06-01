'use client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SectionId } from '@/data/portfolio';
import CursorTrail from './CursorTrail';
import CatHead from './CatHead';
import InteractiveStars from './InteractiveStars';
import CameraController from './CameraController';

interface SceneProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  visitedCount: number;
  isEasterEggActive: boolean;
  onGuideClick: () => void;
}

const StaticEnvironment = React.memo(({ visitedCount }: { visitedCount: number }) => (
  <>
    <color attach="background" args={['#000000']} />
    <fog attach="fog" args={['#000000', 10, 30]} />
    <InteractiveStars />

    <ambientLight intensity={0.2} />
    <directionalLight position={[10, 10, 5]} intensity={2} color="#00ffff" />
    <directionalLight position={[-10, -10, -5]} intensity={2} color="#ff00ff" />

    <CatHead visitedCount={visitedCount} />
    <CursorTrail />

    {/* Bloom: mipmapBlur=true uses cheaper mipmapped blur, height=150 halves the pass resolution */}
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
        height={150}
        intensity={1.2}
      />
    </EffectComposer>
  </>
));
StaticEnvironment.displayName = 'StaticEnvironment';

export default function Scene({ activeSection, setActiveSection, visitedCount, isEasterEggActive, onGuideClick }: SceneProps) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        // Cap pixel ratio: retina (dpr=3) renders 9x the pixels of dpr=1
        // Capping at 1.5 cuts GPU load by ~50% on high-DPR screens with no visible quality loss
        dpr={[1, 1.5]}
        // Hint to the browser this canvas uses WebGL (prevents extra compositing layer)
        style={{ touchAction: 'none' }}
      >
        <StaticEnvironment visitedCount={visitedCount} />
        <CameraController activeSection={activeSection} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!activeSection}
          autoRotateSpeed={0.5}
          maxDistance={15}
          minDistance={2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
