'use client';

import { useEffect } from 'react';
import { CardGameScene } from './components/CardGameScene';

export default function CardGamePage() {
  useEffect(() => {
    document.title = "Card Game";
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <CardGameScene />
    </div>
  );
} 