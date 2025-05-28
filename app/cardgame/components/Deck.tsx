'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useCardGame } from '../hooks/useCardGame';

export const Deck: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { deck, drawCard } = useCardGame();
  
  // カード裏面テクスチャを読み込み
  const cardBackTexture = useTexture('/cardback.png');

  useFrame((state) => {
    if (meshRef.current) {
      // デッキの微細な浮遊アニメーション（机の上で）
      meshRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime) * 0.02;
    }
  });

  if (deck.length === 0) return null;

  return (
    <group>
      {/* デッキの束（複数のカードを重ねて表現） */}
      {deck.slice(0, Math.min(5, deck.length)).map((_, index) => (
        <mesh
          key={index}
          position={[0, 0.8 + index * 0.02, -3.5 - index * 0.01]} // 机の上、奥側に配置
          rotation={[-Math.PI / 2, 0, (Math.random() - 0.5) * 0.1]} // 水平に配置
          onClick={index === 0 ? drawCard : undefined}
          onPointerOver={(e) => {
            if (index === 0) {
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
          castShadow
        >
          <planeGeometry args={[1.6, 2.4]} />
          <meshStandardMaterial
            map={cardBackTexture}
            transparent
            opacity={0.9 + index * 0.02}
          />
        </mesh>
      ))}
      
      {/* デッキ枚数表示 */}
      <mesh position={[0, 1.0, -3.5]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9} 
        />
      </mesh>
      
      {/* デッキ枚数テキスト（将来実装） */}
      <mesh position={[0, 1.01, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshBasicMaterial 
          color="#333333" 
          transparent 
          opacity={0.8} 
        />
      </mesh>
    </group>
  );
}; 