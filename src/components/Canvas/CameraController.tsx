'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SectionId, portfolioData } from '@/data/portfolio';
import * as THREE from 'three';

interface CameraControllerProps {
  activeSection: SectionId;
}

// Pre-allocate vectors OUTSIDE the component — created once, reused every frame
// Creating new THREE.Vector3() inside useFrame causes 120+ GC allocations/sec
const _targetPos = new THREE.Vector3();
const _defaultPos = new THREE.Vector3(0, 0, 10);
const _defaultLook = new THREE.Vector3(0, 0, 0);
const _nodeOffset = new THREE.Vector3(0, 0.5, 3);

export default function CameraController({ activeSection }: CameraControllerProps) {
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useFrame((state) => {
    const camera = state.camera;
    const section = activeSectionRef.current;

    if (section) {
      const nodePos = portfolioData[section].position;
      _targetPos.set(nodePos[0] + _nodeOffset.x, nodePos[1] + _nodeOffset.y, nodePos[2] + _nodeOffset.z);
    } else {
      _targetPos.copy(_defaultPos);
    }

    camera.position.lerp(_targetPos, 0.05);
  });

  return null;
}
