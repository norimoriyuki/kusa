'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

// カスタムスムージング関数
const smoothGeometry = (geometry: THREE.BufferGeometry, iterations: number = 1): THREE.BufferGeometry => {
  const smoothedGeometry = geometry.clone();
  
  for (let i = 0; i < iterations; i++) {
    // 頂点位置の平滑化
    const positions = smoothedGeometry.attributes.position;
    const positionArray = positions.array as Float32Array;
    const vertexCount = positions.count;
    
    // 隣接頂点の平均を計算
    const smoothedPositions = new Float32Array(positionArray.length);
    
    for (let v = 0; v < vertexCount; v++) {
      const vx = v * 3;
      const vy = v * 3 + 1;
      const vz = v * 3 + 2;
      
      // 現在の頂点位置
      let sumX = positionArray[vx];
      let sumY = positionArray[vy];
      let sumZ = positionArray[vz];
      let count = 1;
      
      // 近隣頂点を探して平均化
      for (let n = 0; n < vertexCount; n++) {
        if (n === v) continue;
        
        const nx = n * 3;
        const ny = n * 3 + 1;
        const nz = n * 3 + 2;
        
        const dx = positionArray[vx] - positionArray[nx];
        const dy = positionArray[vy] - positionArray[ny];
        const dz = positionArray[vz] - positionArray[nz];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 閾値以下の距離の頂点を隣接とみなす
        if (distance < 0.1) {
          sumX += positionArray[nx];
          sumY += positionArray[ny];
          sumZ += positionArray[nz];
          count++;
        }
      }
      
      // 平滑化係数（0.5 = 50%の平滑化）
      const smoothFactor = 0.3;
      smoothedPositions[vx] = positionArray[vx] * (1 - smoothFactor) + (sumX / count) * smoothFactor;
      smoothedPositions[vy] = positionArray[vy] * (1 - smoothFactor) + (sumY / count) * smoothFactor;
      smoothedPositions[vz] = positionArray[vz] * (1 - smoothFactor) + (sumZ / count) * smoothFactor;
    }
    
    // 新しい位置を適用
    smoothedGeometry.setAttribute('position', new THREE.BufferAttribute(smoothedPositions, 3));
  }
  
  // 法線を再計算
  smoothedGeometry.computeVertexNormals();
  
  return smoothedGeometry;
};

export const AdvancedSmoothModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // OBJファイルを読み込み
  const obj = useLoader(OBJLoader, '/models3d/soyo/Twilight_Serenity_0528181549_texture.obj');

  // テクスチャを読み込み
  const texture = useTexture('/models3d/soyo/Twilight_Serenity_0528181549_texture.png');

  // 高度にスムース化されたモデルを作成
  const ultraSmoothObj = useMemo(() => {
    if (!obj) return null;
    
    const clonedObj = obj.clone();
    
    clonedObj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        // 1. カスタムスムージング適用
        const smoothedGeometry = smoothGeometry(child.geometry, 2);
        
        // 2. より詳細な法線計算
        smoothedGeometry.computeVertexNormals();
        
        // 3. タンジェント計算（法線マッピング用）
        smoothedGeometry.computeTangents();
        
        // 4. 最適化
        smoothedGeometry.normalizeNormals();
        
        // 5. 新しいジオメトリを適用
        child.geometry = smoothedGeometry;
        
        // 6. 高品質マテリアル
        child.material = new THREE.MeshPhysicalMaterial({
          map: texture,
          side: THREE.DoubleSide,
          // 物理ベースレンダリング
          roughness: 0.2,
          metalness: 0.05,
          clearcoat: 0.3,
          clearcoatRoughness: 0.1,
          // 環境反射
          envMapIntensity: 0.8,
          // 透明度
          transparent: false,
          opacity: 1.0,
          // アンチエイリアシング強化
          premultipliedAlpha: true,
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

  if (!ultraSmoothObj) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={ultraSmoothObj} />
    </group>
  );
}; 