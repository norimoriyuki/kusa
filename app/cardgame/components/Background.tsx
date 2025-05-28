'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardGame } from '../hooks/useCardGame';

export const Background: React.FC = () => {
  const { backgroundColor } = useCardGame();
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const targetColor = useRef(new THREE.Color(backgroundColor));
  const currentColor = useRef(new THREE.Color('#f8f6f0')); // 乳白色

  useEffect(() => {
    targetColor.current.set(backgroundColor);
  }, [backgroundColor]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // 色を滑らかに補間
      currentColor.current.lerp(targetColor.current, delta * 2);
      materialRef.current.color.copy(currentColor.current);
    }
  });

  return (
    <>
      {/* 環境光 */}
      <ambientLight intensity={0.6} />
      
      {/* メインライト */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 補助ライト */}
      <directionalLight
        position={[-5, 8, 3]}
        intensity={0.3}
        color="#fff8e1"
      />
      
      {/* 背景の球体 */}
      <mesh position={[0, 0, -10]} scale={[50, 50, 50]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#f8f6f0"
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* 机 */}
      <mesh 
        position={[0, 0.5, -2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial
          color="#8b4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* 机の脚 */}
      {[
        [-3.5, -0.5, -4.5],
        [3.5, -0.5, -4.5],
        [-3.5, -0.5, 0.5],
        [3.5, -0.5, 0.5]
      ].map((position, index) => (
        <mesh 
          key={index}
          position={position as [number, number, number]} 
          castShadow
        >
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}
      
      {/* 床面（反射効果用） */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#e8e6e0"
          transparent
          opacity={0.8}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </>
  );
}; 