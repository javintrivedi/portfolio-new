'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CursorTrail() {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Track mouse in normalized device coordinates (-1 to +1)
  const mouse = useRef(new THREE.Vector2(0, 0));
  // Track target position in 3D space
  const target = useRef(new THREE.Vector3(0, 0, 2));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Convert normalized mouse coordinates to 3D world space at z=2
    const x = (mouse.current.x * viewport.width) / 2;
    const y = (mouse.current.y * viewport.height) / 2;
    target.current.set(x, y, 2);

    // Lerp the light and mesh towards the target
    if (lightRef.current && meshRef.current) {
      lightRef.current.position.lerp(target.current, 0.1);
      meshRef.current.position.lerp(target.current, 0.1);
    }
  });

  return (
    <>
      <pointLight 
        ref={lightRef} 
        color="#00ffff" 
        intensity={2} 
        distance={5} 
        decay={2} 
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </>
  );
}
