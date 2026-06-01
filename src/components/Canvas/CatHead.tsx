'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CatHeadProps {
  visitedCount: number;
}

// Pre-allocate scale vector — reused every frame
const _scale = new THREE.Vector3();

export default function CatHead({ visitedCount }: CatHeadProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const visitedRef = useRef(visitedCount);
  visitedRef.current = visitedCount;

  // Reduced detail: 16 instead of 24 — still dense-looking sphere but ~50% fewer vertices
  const positions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(4, 16);
    const pos = geo.attributes.position.array as Float32Array;
    geo.dispose(); // Free the geometry — we only need the position array
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const t = state.clock.elapsedTime;
    const baseRotY = t * 0.05;
    const baseRotX = Math.sin(t * 0.2) * 0.05;

    const targetRotX = baseRotX - state.pointer.y * 0.5;
    const targetRotY = baseRotY + state.pointer.x * 0.5;

    pointsRef.current.rotation.x += (targetRotX - pointsRef.current.rotation.x) * 0.1;
    pointsRef.current.rotation.y += (targetRotY - pointsRef.current.rotation.y) * 0.1;

    // Use pre-allocated _scale vector
    const pulse = 1 + Math.sin(t * 2) * 0.02 * (1 + visitedRef.current * 0.5);
    _scale.set(pulse, pulse, pulse);
    pointsRef.current.scale.copy(_scale);
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
          color="#e8e8e8"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>

      <mesh>
        <icosahedronGeometry args={[3.95, 2]} />
        <meshBasicMaterial color="#e8e8e8" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
