'use client';

import { useEffect } from 'react';
import { F451Scene } from './components/F451Scene';

export default function F451Page() {
  useEffect(() => {
    document.title = "F451";
  }, []);

  const handleBurnComplete = () => {
    console.log('紙が完全に燃え尽きました');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* 3Dシーン - 全画面 */}
      <div className="fixed inset-0">
        <F451Scene
          burnSpeed={0.2}
          autoStart={true}
          onBurnComplete={handleBurnComplete}
        />
      </div>
    </div>
  );
} 