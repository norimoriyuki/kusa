'use client';

import { useState } from 'react';
import { F451Scene } from './components/F451Scene';

export default function F451Page() {
  const [isStarted, setIsStarted] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const handleBurnComplete = () => {
    console.log('紙が完全に燃え尽きました');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* 3Dシーン - 全画面 */}
      <div className="fixed inset-0">
        <F451Scene
          key={resetKey}
          burnSpeed={0.2}
          autoStart={isStarted}
          onBurnComplete={handleBurnComplete}
        />
      </div>
    </div>
  );
} 