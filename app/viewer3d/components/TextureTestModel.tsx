'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader, MTLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { useTextureContext } from './TextureContext';

export const TextureTestModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { setCurrentTexture } = useTextureContext();
  
  // MTLファイルを読み込み
  const materials = useLoader(MTLLoader, '/models3d/soyo/Twilight_Serenity_0528181549_texture.mtl');
  
  // OBJファイルを読み込み（MTLと組み合わせ）
  const obj = useLoader(OBJLoader, '/models3d/soyo/Twilight_Serenity_0528181549_texture.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // PNGテクスチャを直接読み込み
  const pngTexture = useTexture('/models3d/soyo/Twilight_Serenity_0528181549_texture.png');

  // テクスチャをコンテキストに設定
  useEffect(() => {
    if (pngTexture) {
      setCurrentTexture(pngTexture);
    }
    return () => {
      setCurrentTexture(null);
    };
  }, [pngTexture, setCurrentTexture]);

  // テクスチャ設定を最適化
  const optimizedObj = useMemo(() => {
    if (!obj) return null;
    
    const clonedObj = obj.clone();
    
    // テクスチャの設定を最適化
    pngTexture.wrapS = THREE.RepeatWrapping;
    pngTexture.wrapT = THREE.RepeatWrapping;
    pngTexture.flipY = false; // OBJファイル用の設定
    pngTexture.colorSpace = THREE.SRGBColorSpace; // 色空間設定
    
    clonedObj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // 高品質なマテリアルでPNGテクスチャを適用
        child.material = new THREE.MeshStandardMaterial({
          map: pngTexture,
          side: THREE.DoubleSide,
          
          // テクスチャ品質向上
          transparent: pngTexture.format === THREE.RGBAFormat,
          alphaTest: 0.1,
          
          // 表面特性
          roughness: 0.4,
          metalness: 0.1,
          
          // 法線とライティング
          flatShading: false,
          
          // 環境マッピング
          envMapIntensity: 0.3,
        });
        
        child.castShadow = true;
        child.receiveShadow = true;
        
        // デバッグ情報をコンソールに出力
        console.log('🎨 テクスチャ情報:', {
          width: pngTexture.image?.width,
          height: pngTexture.image?.height,
          format: pngTexture.format,
          type: pngTexture.type,
          colorSpace: pngTexture.colorSpace
        });
      }
    });
    
    return clonedObj;
  }, [obj, pngTexture]);

  // 回転アニメーション
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  if (!optimizedObj) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={optimizedObj} />
      
      {/* テクスチャテスト用のプレーン */}
      <mesh position={[3, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial 
          map={pngTexture} 
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
      
      {/* テクスチャ情報表示用のテキスト（デバッグ） */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}; 