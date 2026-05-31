'use client';

import { useFrame } from '@react-three/fiber';
import { SectionId, portfolioData } from '@/data/portfolio';
import * as THREE from 'three';

interface CameraControllerProps {
  activeSection: SectionId;
}

export default function CameraController({ activeSection }: CameraControllerProps) {
  useFrame((state) => {
    const camera = state.camera;
    
    // Default camera position (zoomed out, observing the core)
    let targetPosition = new THREE.Vector3(0, 0, 10);
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    if (activeSection) {
      // If a node is active, fly to it
      const nodePos = new THREE.Vector3(...portfolioData[activeSection].position);
      
      // Position the camera slightly in front and above the node
      targetPosition = nodePos.clone().add(new THREE.Vector3(0, 0.5, 3));
      targetLookAt = nodePos;
    }

    // Smoothly interpolate the camera's position
    camera.position.lerp(targetPosition, 0.05);

    // To lerp the lookAt, we need to lerp the camera's rotation.
    // Three.js doesn't have a direct lerpLookAt, so we use a dummy object or quaternions.
    // An easy approximation for this use case is to adjust the lookAt target.
    
    // We can't easily lerp `camera.lookAt` directly because it sets rotation instantly.
    // Instead, we maintain a target lookAt vector and lerp it, then tell the camera to look at it.
    // Wait, state doesn't persist the current lookAt easily without refs.
    // For simplicity, if we rely on OrbitControls for default looking, we shouldn't mix them.
    // Since we disabled OrbitControls' panning, we can just let OrbitControls handle the target 
    // in Scene.tsx, or we can disable OrbitControls when active.
  });

  return null;
}
