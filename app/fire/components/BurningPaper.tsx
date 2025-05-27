'use client';

import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { paperBurnVertexShader, paperBurnFragmentShader } from '../../shaders/shaderUtils';

interface BurningPaperProps {
  burnSpeed?: number;
  autoStart?: boolean;
  onBurnComplete?: () => void;
}

export interface BurningPaperRef {
  reset: () => void;
  start: () => void;
}

export const BurningPaper = forwardRef<BurningPaperRef, BurningPaperProps>(({ 
  burnSpeed = 0.01, 
  autoStart = true,
  onBurnComplete 
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const burnValueRef = useRef(autoStart ? -0.5 : -1.0);
  const timeRef = useRef(0);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: paperBurnVertexShader,
      fragmentShader: paperBurnFragmentShader,
      uniforms: {
        burnValue: { value: burnValueRef.current },
        time: { value: 0 },
        burnColor: { value: new THREE.Color(1.0, 0.3, 0.0) }, // オレンジ色の炎
        emberColor: { value: new THREE.Color(1.0, 0.1, 0.0) }, // 赤い炎
        noiseScale: { value: 3.0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // 燃焼をリセット
  const resetBurn = () => {
    burnValueRef.current = -0.5;
    timeRef.current = 0;
    if (materialRef.current) {
      materialRef.current.uniforms.burnValue.value = burnValueRef.current;
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  };

  // 燃焼を開始
  const startBurn = () => {
    if (burnValueRef.current >= 1.0) {
      resetBurn();
    }
  };

  useImperativeHandle(ref, () => ({
    reset: resetBurn,
    start: startBurn
  }));

  useFrame((state, delta) => {
    if (materialRef.current) {
      // 時間を更新
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;

      // 燃焼進行
      if (autoStart && burnValueRef.current < 1.0) {
        burnValueRef.current += burnSpeed * delta;
        materialRef.current.uniforms.burnValue.value = burnValueRef.current;

        // 燃焼完了チェック
        if (burnValueRef.current >= 1.0 && onBurnComplete) {
          onBurnComplete();
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[4, 6, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={paperBurnVertexShader}
        fragmentShader={paperBurnFragmentShader}
        uniforms={shaderMaterial.uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}); 