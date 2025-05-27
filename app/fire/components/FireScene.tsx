'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { BurningPaper } from './BurningPaper';

interface FireSceneProps {
  burnSpeed?: number;
  autoStart?: boolean;
  onBurnComplete?: () => void;
}

export function FireScene({ 
  burnSpeed = 0.01, 
  autoStart = true,
  onBurnComplete 
}: FireSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)' }}
      >
        {/* 照明設定 */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          color="#ff6600"
        />
        <pointLight 
          position={[0, 0, 2]} 
          intensity={1.0} 
          color="#ff3300"
          distance={10}
          decay={2}
        />

        {/* 環境マッピング */}
        <Environment preset="night" />

        {/* 燃焼する紙 */}
        <BurningPaper
          burnSpeed={burnSpeed}
          autoStart={autoStart}
          onBurnComplete={onBurnComplete}
        />

        {/* カメラコントロール */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
} 