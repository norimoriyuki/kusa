'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

export const BasicModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // OBJファイルを読み込み
  const obj = useLoader(OBJLoader, '/models3d/soyo/Twilight_Serenity_0528181549_texture.obj');

  // テクスチャを読み込み
  const texture = useTexture('/models3d/soyo/Twilight_Serenity_0528181549_texture.png');

  // 回転アニメーション
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  // 基本的なマテリアル適用（スムージングなし）
  if (obj) {
    obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          // フラットシェーディング（ポリゴンらしさを保持）
          flatShading: true,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={obj} />
    </group>
  );
}; 