'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CatHeadProps {
  visitedCount: number;
}

export default function CatHead({ visitedCount }: CatHeadProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate a high density sphere to represent the halftone dots
  const [positions] = useMemo(() => {
    // Icosahedron with high detail creates a very even point distribution on a sphere
    const geo = new THREE.IcosahedronGeometry(4, 24); // 24 detail = lots of points!
    
    // We only need the vertices for a point cloud
    const pos = geo.attributes.position.array;
    
    return [pos];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Base continuous rotation
      const baseRotY = state.clock.elapsedTime * 0.05;
      const baseRotX = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      
      // Target rotation based on mouse pointer (gyroscopic effect)
      // Multiply by a factor to control the intensity of the parallax
      const targetRotX = baseRotX - state.pointer.y * 0.5;
      const targetRotY = baseRotY + state.pointer.x * 0.5;

      // Smoothly interpolate current rotation towards target
      pointsRef.current.rotation.x += (targetRotX - pointsRef.current.rotation.x) * 0.1;
      pointsRef.current.rotation.y += (targetRotY - pointsRef.current.rotation.y) * 0.1;
      
      // Subtle breathing effect based on visited count
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02 * (1 + visitedCount * 0.5);
      pointsRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#e9b825ff"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>
      
      {/* Subtle inner glow / wireframe to give it structure */}
      <mesh>
        <icosahedronGeometry args={[3.95, 2]} />
        <meshBasicMaterial color="#e9b825ff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
