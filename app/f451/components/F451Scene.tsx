'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { F451BurningPaper } from './F451BurningPaper';

interface F451SceneProps {
  burnSpeed?: number;
  autoStart?: boolean;
  onBurnComplete?: () => void;
}

export function F451Scene({ 
  burnSpeed = 0.005, 
  autoStart = false,
  onBurnComplete 
}: F451SceneProps) {
  return (
    <div className="w-full h-full relative">
      {/* 背景の「Fahrenheit 451」文字 - HTML版 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl font-bold text-orange-500/80 tracking-wider">
            FAHRENHEIT
          </h1>
          <h2 className="text-9xl md:text-[12rem] font-bold text-orange-600/90 tracking-widest -mt-4">
            451
          </h2>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        className="relative z-10"
      >
        {/* 照明設定 */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#ff6600"
        />
        <pointLight 
          position={[0, 0, 3]} 
          intensity={1.5} 
          color="#ff3300"
          distance={15}
          decay={2}
        />

        {/* 燃える紙（画面全体を覆う） */}
        <F451BurningPaper
          burnSpeed={burnSpeed}
          autoStart={autoStart}
          onBurnComplete={onBurnComplete}
        />

        {/* カメラコントロール（制限付き） */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
} 