'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Background } from './Background';
import { Deck } from './Deck';
import { Hand } from './Hand';

export const CardGameScene: React.FC = () => {
  return (
    <Canvas
      camera={{
        position: [0, 5, 8],
        fov: 60,
        near: 0.1,
        far: 1000
      }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      {/* 背景とライティング */}
      <Background />
      
      {/* デッキ */}
      <Deck />
      
      {/* 手札 */}
      <Hand />
      
      {/* カメラコントロール（開発用） */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={15}
      />
    </Canvas>
  );
}; 