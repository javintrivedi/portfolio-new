'use client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
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
    {/* Environment */}
    <color attach="background" args={['#000000']} />
    <fog attach="fog" args={['#000000', 10, 30]} />
    <InteractiveStars />
    
    {/* Lights */}
    <ambientLight intensity={0.2} />
    <directionalLight position={[10, 10, 5]} intensity={2} color="#00ffff" />
    <directionalLight position={[-10, -10, -5]} intensity={2} color="#ff00ff" />
    
    {/* Cat Head / Core Geometry */}
    <CatHead visitedCount={visitedCount} />

    {/* Phase 3: Cursor Gravity */}
    <CursorTrail />

    {/* Post-processing */}
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
    </EffectComposer>
  </>
));

export default function Scene({ activeSection, setActiveSection, visitedCount, isEasterEggActive, onGuideClick }: SceneProps) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <StaticEnvironment visitedCount={visitedCount} />

        {/* Controls */}
        <CameraController activeSection={activeSection} />
        {/* Make autoRotate stop when a section is active */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          autoRotate={!activeSection} 
          autoRotateSpeed={0.5} 
          maxDistance={15}
          minDistance={2}
          makeDefault // Required so useThree().controls works in CameraController if needed
        />
      </Canvas>
    </div>
  );
}
