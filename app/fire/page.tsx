'use client';

import { useState } from 'react';
import { FireScene } from './components/FireScene';
import { FireControls } from './components/FireControls';

export default function FirePage() {
  const [burnSpeed, setBurnSpeed] = useState(0.01);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const handleBurnComplete = () => {
    console.log('燃焼完了！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">
            🔥 紙燃焼シミュレーター
          </h1>
          <p className="text-orange-200">
            カスタムGLSLシェーダーによるリアルタイム燃焼アニメーション
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* 3Dビューアー */}
          <div className="lg:col-span-3 bg-black rounded-lg shadow-lg overflow-hidden border border-orange-500/30">
            <FireScene
              key={resetKey}
              burnSpeed={burnSpeed}
              autoStart={true}
              onBurnComplete={handleBurnComplete}
            />
          </div>

          {/* コントロールパネル */}
          <div className="lg:col-span-1">
            <FireControls
              burnSpeed={burnSpeed}
              onBurnSpeedChange={setBurnSpeed}
              onReset={handleReset}
            />
          </div>
        </div>

        <footer className="mt-8 text-center text-orange-300 text-sm">
          <p>
            GLSLシェーダーで実装された紙の燃焼エフェクト。
          </p>
          <p className="mt-2">
            ノイズ関数による不規則な燃え広がりとリアルタイムパーティクルシステム。
          </p>
        </footer>
      </div>
    </div>
  );
} 