'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { BasicModel } from './BasicModel';
import { SoyoModel } from './SoyoModel';
import { AdvancedSmoothModel } from './AdvancedSmoothModel';
import { TextureTestModel } from './TextureTestModel';
import { TextureInfo } from './TextureInfo';
import { TextureProvider, useTextureContext } from './TextureContext';
import { LoadingFallback } from './LoadingFallback';

const Viewer3DContent: React.FC = () => {
  const [smoothMode, setSmoothMode] = useState<'basic' | 'advanced' | 'ultra' | 'texture'>('basic');
  const { currentTexture } = useTextureContext();

  return (
    <>
      {/* コントロールパネル */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
        <h3 className="text-lg font-bold mb-3">🎨 表示モード設定</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="smooth"
              value="basic"
              checked={smoothMode === 'basic'}
              onChange={(e) => setSmoothMode(e.target.value as any)}
              className="text-blue-500"
            />
            <span>基本（フラットシェーディング）</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="smooth"
              value="advanced"
              checked={smoothMode === 'advanced'}
              onChange={(e) => setSmoothMode(e.target.value as any)}
              className="text-blue-500"
            />
            <span>スムース（法線最適化）</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="smooth"
              value="ultra"
              checked={smoothMode === 'ultra'}
              onChange={(e) => setSmoothMode(e.target.value as any)}
              className="text-blue-500"
            />
            <span>ウルトラスムース（頂点平滑化）</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="smooth"
              value="texture"
              checked={smoothMode === 'texture'}
              onChange={(e) => setSmoothMode(e.target.value as any)}
              className="text-blue-500"
            />
            <span>🖼️ テクスチャテスト（PNG確認）</span>
          </label>
        </div>
        
        {/* 説明テキスト */}
        <div className="mt-4 text-sm text-gray-300">
          {smoothMode === 'basic' && '🔲 ポリゴンの角がはっきり見える'}
          {smoothMode === 'advanced' && '✨ 法線を最適化して滑らか'}
          {smoothMode === 'ultra' && '🌟 頂点レベルで平滑化処理'}
          {smoothMode === 'texture' && '🖼️ PNGテクスチャの詳細確認'}
        </div>
        
        {/* テクスチャモード時の追加情報 */}
        {smoothMode === 'texture' && (
          <div className="mt-3 p-2 bg-blue-900/50 rounded text-xs">
            <p>📋 テクスチャ情報:</p>
            <p>• 右側にテクスチャサンプル表示</p>
            <p>• コンソールで詳細情報確認</p>
            <p>• MTL + PNG の組み合わせテスト</p>
          </div>
        )}
      </div>

      {/* テクスチャ情報パネル（テクスチャモード時のみ） */}
      {smoothMode === 'texture' && currentTexture && (
        <TextureInfo texture={currentTexture} />
      )}

      <Canvas
        camera={{
          position: [5, 5, 5],
          fov: 50,
        }}
        shadows
        gl={{ antialias: true }}
      >
        {/* 環境光とディレクショナルライト */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* 環境マップ */}
        <Environment preset="sunset" />
        
        {/* グリッド */}
        <Grid
          renderOrder={-1}
          position={[0, -1, 0]}
          infiniteGrid
          cellSize={0.6}
          cellThickness={0.6}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor="#8080ff"
          fadeDistance={30}
        />
        
        {/* 3Dモデル（表示モードに応じて切り替え） */}
        <Suspense fallback={<LoadingFallback />}>
          {smoothMode === 'basic' && <BasicModel />}
          {smoothMode === 'advanced' && <SoyoModel />}
          {smoothMode === 'ultra' && <AdvancedSmoothModel />}
          {smoothMode === 'texture' && <TextureTestModel />}
        </Suspense>
        
        {/* カメラコントロール */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>
    </>
  );
};

export const Viewer3DScene: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <TextureProvider>
        <Viewer3DContent />
      </TextureProvider>
    </div>
  );
}; 