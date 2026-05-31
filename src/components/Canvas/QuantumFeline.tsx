'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { synth } from '@/components/Audio/Synthesizer';

interface QuantumFelineProps {
  onClick?: () => void;
}

export default function QuantumFeline({ onClick }: QuantumFelineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Random base offsets so it doesn't start at 0,0,0
  const randomOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() + randomOffset;
    
    if (groupRef.current) {
      // Orbit around the core
      const radius = 6 + Math.sin(t * 0.5) * 2;
      groupRef.current.position.x = Math.cos(t * 0.3) * radius;
      groupRef.current.position.z = Math.sin(t * 0.3) * radius;
      
      // Look roughly towards where it's going
      const nextX = Math.cos((t + 0.1) * 0.3) * radius;
      const nextZ = Math.sin((t + 0.1) * 0.3) * radius;
      groupRef.current.lookAt(nextX, groupRef.current.position.y, nextZ);
    }

    if (bodyRef.current) {
      // Bob up and down to simulate walking
      bodyRef.current.position.y = Math.sin(t * 4) * 0.1;
      
      // Click animation (barrel roll)
      if (clicked) {
        bodyRef.current.rotation.z += delta * 15;
        if (bodyRef.current.rotation.z > Math.PI * 2) {
          bodyRef.current.rotation.z = 0;
          setClicked(false);
        }
      } else {
        // Reset rotation if not clicked
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, 0.1);
      }
    }

    if (tailRef.current) {
      // Wag tail
      tailRef.current.rotation.z = Math.sin(t * 8) * 0.5;
    }
  });

  // Colors
  const catColor = "#111111"; // Dark grey/black body
  const eyeColor = hovered ? "#00ffff" : "#aa00ff"; // Glowing eyes

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!hovered) {
          setHover(true);
          synth.playHover();
        }
        document.body.style.cursor = 'help';
      }}
      onPointerOut={(e) => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!clicked) {
          setClicked(true);
          synth.playClick();
          if (onClick) onClick();
        }
      }}
    >
      <group ref={bodyRef}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.8]} />
          <meshStandardMaterial color={catColor} roughness={0.8} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.3, 0.4]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color={catColor} roughness={0.8} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.12, 0.55, 0.4]}>
          <coneGeometry args={[0.1, 0.2, 4]} />
          <meshStandardMaterial color={catColor} />
        </mesh>
        <mesh position={[0.12, 0.55, 0.4]}>
          <coneGeometry args={[0.1, 0.2, 4]} />
          <meshStandardMaterial color={catColor} />
        </mesh>

        {/* Eyes (Glowing) */}
        <mesh position={[-0.08, 0.35, 0.58]}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.08, 0.35, 0.58]}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
        </mesh>

        {/* Tail (with its own group for pivot) */}
        <group position={[0, 0.1, -0.4]} ref={tailRef}>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color={catColor} />
          </mesh>
        </group>
        
        {/* Legs */}
        {/* Front Left */}
        <mesh position={[-0.1, -0.3, 0.2]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={catColor} />
        </mesh>
        {/* Front Right */}
        <mesh position={[0.1, -0.3, 0.2]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={catColor} />
        </mesh>
        {/* Back Left */}
        <mesh position={[-0.1, -0.3, -0.2]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={catColor} />
        </mesh>
        {/* Back Right */}
        <mesh position={[0.1, -0.3, -0.2]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={catColor} />
        </mesh>

      </group>
    </group>
  );
}
