'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

import { Sparkles } from '@react-three/drei';

interface CoreProps {
  visitedCount: number;
  isEasterEggActive: boolean;
}

export default function Core({ visitedCount, isEasterEggActive }: CoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Base rotation + extra spin based on charge
      let rotationSpeed = 0.2 + (visitedCount * 0.3);
      
      // Easter Egg Meltdown Spin
      if (isEasterEggActive) {
        rotationSpeed = 10; // Extremely fast spin
      }

      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * (rotationSpeed * 0.5);

      // Charge visuals
      const targetIntensity = 0.5 + (visitedCount * 1.5);
      
      // Color shifts from dark grey -> cyan -> magenta -> white based on charge
      let targetColor = new THREE.Color('#111111');
      if (visitedCount === 1) targetColor.set('#004444');
      if (visitedCount === 2) targetColor.set('#008888');
      if (visitedCount === 3) targetColor.set('#880088');
      if (visitedCount >= 4) targetColor.set('#ffffff');

      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity, 
        targetIntensity, 
        0.1
      );
      
      materialRef.current.emissive.lerp(targetColor, 0.05);

      // If fully charged, pulse wildly
      if (visitedCount >= 4 && !isEasterEggActive) {
        const pulse = 4 + Math.sin(state.clock.elapsedTime * 10) * 2;
        materialRef.current.emissiveIntensity = pulse;
      }

      // Meltdown visuals
      if (isEasterEggActive) {
        materialRef.current.emissive.set('#ff0000'); // Turn red
        materialRef.current.color.set('#ff0000');
        
        // Rapid expansion and fade out
        meshRef.current.scale.lerp(new THREE.Vector3(10, 10, 10), 0.05);
        
        // Fade out wireframe
        materialRef.current.transparent = true;
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.05);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#222222" 
          wireframe 
          emissive="#111111"
          emissiveIntensity={0.5}
        />
        {isEasterEggActive && (
          <Sparkles count={500} scale={20} size={5} speed={2} color="#ff0000" />
        )}
      </mesh>
    </Float>
  );
}
