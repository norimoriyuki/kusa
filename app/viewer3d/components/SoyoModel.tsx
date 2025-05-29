'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

export const SoyoModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // OBJファイルを読み込み
  const obj = useLoader(OBJLoader, '/models3d/soyo/Twilight_Serenity_0528181549_texture.obj');

  // テクスチャを読み込み
  const texture = useTexture('/models3d/soyo/Twilight_Serenity_0528181549_texture.png');

  // スムース化されたモデルを作成
  const smoothedObj = useMemo(() => {
    if (!obj) return null;
    
    const clonedObj = obj.clone();
    
    clonedObj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        
        // 1. 法線を再計算してスムースシェーディング
        geometry.computeVertexNormals();
        
        // 2. より滑らかな法線計算（角度閾値を設定）
        geometry.normalizeNormals();
        
        // 3. ジオメトリの最適化
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        
        // 4. 高品質マテリアルを適用
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          // スムースシェーディングを強化
          flatShading: false,
          // 表面の滑らかさを調整
          roughness: 0.3,
          metalness: 0.1,
          // 環境マッピングを有効化
          envMapIntensity: 0.5,
          // 法線マップの強度
          normalScale: new THREE.Vector2(1, 1),
        });
        
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return clonedObj;
  }, [obj, texture]);

  // 回転アニメーション
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  if (!smoothedObj) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={smoothedObj} />
    </group>
  );
}; 