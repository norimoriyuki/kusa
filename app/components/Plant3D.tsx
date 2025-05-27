'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LSystem, LSystemConfig } from '../lib/lsystem';
import { PlantGeometry } from '../lib/plant-geometry';

interface Plant3DProps {
  config: LSystemConfig;
  autoRotate?: boolean;
}

export function Plant3D({ config, autoRotate = true }: Plant3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const lSystem = new LSystem(config);
    const lSystemString = lSystem.generate();
    const plantGeometry = new PlantGeometry(config);
    return plantGeometry.generateGeometry(lSystemString);
  }, [config]);

  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
} 