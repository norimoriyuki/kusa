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
  getBurnValue: () => number;
}

export const BurningPaper = forwardRef<BurningPaperRef, BurningPaperProps>(({ 
  burnSpeed = 0.008, // より遅い燃焼速度でリアルに
  autoStart = true,
  onBurnComplete 
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const burnValueRef = useRef(autoStart ? -0.8 : -1.0); // より低い初期値
  const timeRef = useRef(0);
  const burnSpeedVariationRef = useRef(1.0); // 燃焼速度のランダム変動

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: paperBurnVertexShader,
      fragmentShader: paperBurnFragmentShader,
      uniforms: {
        burnValue: { value: burnValueRef.current },
        time: { value: 0 },
        burnColor: { value: new THREE.Color(1.0, 0.4, 0.0) }, // より明るいオレンジ
        emberColor: { value: new THREE.Color(0.8, 0.1, 0.0) }, // 深い赤
        noiseScale: { value: 4.0 } // より細かいノイズ
      },
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.1, // アルファテストで縁をシャープに
    });
  }, []);

  // 燃焼をリセット
  const resetBurn = () => {
    burnValueRef.current = -0.8;
    timeRef.current = 0;
    burnSpeedVariationRef.current = 0.8 + Math.random() * 0.4; // 0.8-1.2の範囲でランダム
    
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

  // 燃焼値を取得
  const getBurnValue = () => burnValueRef.current;

  useImperativeHandle(ref, () => ({
    reset: resetBurn,
    start: startBurn,
    getBurnValue
  }));

  useFrame((state, delta) => {
    if (materialRef.current) {
      // 時間を更新
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;

      // 燃焼進行
      if (autoStart && burnValueRef.current < 1.2) { // 少し余裕を持たせる
        // ランダムな燃焼速度変動
        const speedVariation = burnSpeedVariationRef.current;
        
        // 時間による微細な速度変化（風の影響をシミュレート）
        const windEffect = Math.sin(timeRef.current * 0.5) * 0.1 + 1.0;
        
        // 燃焼進行度による速度変化（燃え始めは遅く、中盤で加速）
        const progressFactor = Math.min(1.0, Math.max(0.3, 
          1.0 - Math.abs(burnValueRef.current) * 0.8
        ));
        
        const finalBurnSpeed = burnSpeed * speedVariation * windEffect * progressFactor;
        burnValueRef.current += finalBurnSpeed * delta;
        
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
      <planeGeometry args={[4, 6, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={paperBurnVertexShader}
        fragmentShader={paperBurnFragmentShader}
        uniforms={shaderMaterial.uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        alphaTest={0.1}
      />
    </mesh>
  );
}); 