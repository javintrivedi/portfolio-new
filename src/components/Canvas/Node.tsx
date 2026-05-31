'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PortfolioSection, SectionId } from '@/data/portfolio';
import * as THREE from 'three';
import { synth } from '@/components/Audio/Synthesizer';
import { useMemo } from 'react';

interface NodeProps {
  data: PortfolioSection;
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

export default function Node({ data, activeSection, setActiveSection }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  const isActive = activeSection === data.id;
  
  // Randomly select a musical note symbol
  const noteSymbol = useMemo(() => {
    const notes = ['♫', '♪', '♬', '♩'];
    return notes[Math.floor(Math.random() * notes.length)];
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      // Animate scale on hover or active
      const targetScale = isActive ? 1.5 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!hovered) {
          setHover(true);
          synth.playHover();
        }
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveSection(isActive ? null : data.id);
        synth.playClick();
      }}
    >
      <Text
        fontSize={isActive ? 1.5 : 1}
        color={hovered || isActive ? data.color : '#aaaaaa'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={hovered || isActive ? 0.05 : 0}
        outlineColor={data.color}
      >
        {noteSymbol}
      </Text>
    </mesh>
  );
}
