'use client';

import { useEffect } from 'react';
import { Viewer3DScene } from './components/Viewer3DScene';

export default function Viewer3DPage() {
  useEffect(() => {
    document.title = '3D Viewer';
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Viewer3DScene />
    </div>
  );
} 