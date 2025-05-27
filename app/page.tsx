'use client';

import { useState, useEffect } from 'react';
import { LSystem, LSystemConfig } from './lib/lsystem';
import { PlantViewer } from './components/PlantViewer';
import { ControlPanel } from './components/ControlPanel';

export default function Home() {
  const [config, setConfig] = useState<LSystemConfig | null>(null);

  // クライアントサイドでのみ初期設定を生成
  useEffect(() => {
    setConfig(LSystem.getRandomPlantConfig());
  }, []);

  const handleRandomGenerate = () => {
    setConfig(LSystem.getRandomPlantConfig());
  };

  // 設定が読み込まれるまでローディング表示
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">草生やし中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌿 草生やすアプリ
          </h1>
          <p className="text-gray-600">
            L-systemアルゴリズムでランダムに草を生やします
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* 3Dビューアー */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
            <PlantViewer config={config} />
          </div>

          {/* コントロールパネル */}
          <div className="lg:col-span-1">
            <ControlPanel
              config={config}
              onConfigChange={setConfig}
              onRandomGenerate={handleRandomGenerate}
            />
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            L-system（Lindenmayer system）は、草が生えるパターンを数学的にモデル化する手法です。
          </p>
          <p className="mt-2">
            マウスで3D草を自由に回転・ズームして観察してください。
          </p>
        </footer>
      </div>
    </div>
  );
}
