'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import * as THREE from 'three';

interface TextureContextType {
  currentTexture: THREE.Texture | null;
  setCurrentTexture: (texture: THREE.Texture | null) => void;
}

const TextureContext = createContext<TextureContextType | undefined>(undefined);

export const TextureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);

  return (
    <TextureContext.Provider value={{ currentTexture, setCurrentTexture }}>
      {children}
    </TextureContext.Provider>
  );
};

export const useTextureContext = () => {
  const context = useContext(TextureContext);
  if (context === undefined) {
    throw new Error('useTextureContext must be used within a TextureProvider');
  }
  return context;
}; 