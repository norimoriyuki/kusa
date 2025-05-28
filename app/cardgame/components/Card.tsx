'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CardData } from '../types/card';
import { useCardGame } from '../hooks/useCardGame';

interface CardProps {
  card: CardData;
  isInHand?: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isInHand = false, isSelected = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectCard } = useCardGame();
  const [hovered, setHovered] = useState(false);
  
  // アニメーション用の現在位置と回転
  const currentPosition = useRef(new THREE.Vector3(card.position.x, card.position.y, card.position.z));
  const currentRotation = useRef(new THREE.Euler(card.rotation.x, card.rotation.y, card.rotation.z));
  const targetPosition = useRef(new THREE.Vector3(card.position.x, card.position.y, card.position.z));
  const targetRotation = useRef(new THREE.Euler(card.rotation.x, card.rotation.y, card.rotation.z));
  
  // カード裏面テクスチャを読み込み
  const cardBackTexture = useTexture('/cardback.png');

  // 位置と回転の更新
  useEffect(() => {
    targetPosition.current.set(card.position.x, card.position.y, card.position.z);
    targetRotation.current.set(card.rotation.x, card.rotation.y, card.rotation.z);
  }, [card.position, card.rotation]);

  // カード表面テクスチャを生成
  const frontTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // 高解像度設定
    canvas.width = 512;
    canvas.height = 768;
    
    // canvasを上下反転（カードが上下逆に表示されるため）
    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(0, -canvas.height);
    
    // 背景色
    ctx.fillStyle = card.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // カードの枠
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    
    // 内側の装飾枠
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
    
    // カード名
    ctx.fillStyle = card.textColor || '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(card.name, canvas.width / 2, 100);
    
    // 将来のページ情報表示エリア
    if (card.pageTitle) {
      ctx.font = '24px Arial';
      ctx.fillText(card.pageTitle, canvas.width / 2, canvas.height / 2);
      
      if (card.pageDescription) {
        ctx.font = '18px Arial';
        ctx.fillText(card.pageDescription, canvas.width / 2, canvas.height / 2 + 40);
      }
    }
    
    // 中央の装飾
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    return texture;
  }, [card]);

  // 表示するテクスチャを決定
  const displayTexture = isInHand ? frontTexture : cardBackTexture;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 位置と回転のアニメーション
      currentPosition.current.lerp(targetPosition.current, delta * 8);
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * delta * 8;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * delta * 8;
      currentRotation.current.z += (targetRotation.current.z - currentRotation.current.z) * delta * 8;
      
      meshRef.current.position.copy(currentPosition.current);
      meshRef.current.rotation.copy(currentRotation.current);
      
      // 選択されたカードの光るエフェクト
      if (isSelected) {
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.02;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={isSelected ? 1.1 : card.scale}
      onClick={() => selectCard(card)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <planeGeometry args={[1.6, 2.4]} />
      <meshStandardMaterial
        map={displayTexture}
        transparent
        opacity={hovered ? 0.9 : 1.0}
        emissive={isSelected ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
      />
    </mesh>
  );
}; 