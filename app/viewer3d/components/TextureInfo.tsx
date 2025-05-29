'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

interface TextureInfoData {
  width: number;
  height: number;
  format: string;
  type: string;
  colorSpace: string;
  fileSize: string;
  hasAlpha: boolean;
}

interface TextureInfoProps {
  texture?: THREE.Texture;
}

export const TextureInfo: React.FC<TextureInfoProps> = ({ texture }) => {
  const [textureInfo, setTextureInfo] = useState<TextureInfoData | null>(null);

  useEffect(() => {
    if (texture && texture.image) {
      const formatNames: { [key: number]: string } = {
        [THREE.RGBAFormat]: 'RGBA',
        [THREE.RGBFormat]: 'RGB',
        [THREE.AlphaFormat]: 'Alpha',
        [THREE.RedFormat]: 'Red',
        [THREE.RGFormat]: 'RG',
      };

      const typeNames: { [key: number]: string } = {
        [THREE.UnsignedByteType]: 'UnsignedByte',
        [THREE.ByteType]: 'Byte',
        [THREE.ShortType]: 'Short',
        [THREE.UnsignedShortType]: 'UnsignedShort',
        [THREE.IntType]: 'Int',
        [THREE.UnsignedIntType]: 'UnsignedInt',
        [THREE.FloatType]: 'Float',
        [THREE.HalfFloatType]: 'HalfFloat',
      };

      // ファイルサイズを推定（概算）
      const estimatedSize = (texture.image.width * texture.image.height * 4) / 1024; // KB

      setTextureInfo({
        width: texture.image.width,
        height: texture.image.height,
        format: formatNames[texture.format] || `Unknown (${texture.format})`,
        type: typeNames[texture.type] || `Unknown (${texture.type})`,
        colorSpace: texture.colorSpace,
        fileSize: `約 ${estimatedSize.toFixed(1)} KB`,
        hasAlpha: texture.format === THREE.RGBAFormat,
      });
    }
  }, [texture]);

  if (!textureInfo) {
    return (
      <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
        <p>🔄 テクスチャ読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
      <h3 className="text-lg font-bold mb-3">🖼️ PNG テクスチャ情報</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>📐 解像度:</span>
          <span className="text-blue-300">{textureInfo.width} × {textureInfo.height}</span>
        </div>
        
        <div className="flex justify-between">
          <span>🎨 フォーマット:</span>
          <span className="text-green-300">{textureInfo.format}</span>
        </div>
        
        <div className="flex justify-between">
          <span>🔢 データ型:</span>
          <span className="text-yellow-300">{textureInfo.type}</span>
        </div>
        
        <div className="flex justify-between">
          <span>🌈 色空間:</span>
          <span className="text-purple-300">{textureInfo.colorSpace}</span>
        </div>
        
        <div className="flex justify-between">
          <span>💾 推定サイズ:</span>
          <span className="text-orange-300">{textureInfo.fileSize}</span>
        </div>
        
        <div className="flex justify-between">
          <span>✨ 透明度:</span>
          <span className={textureInfo.hasAlpha ? 'text-green-300' : 'text-red-300'}>
            {textureInfo.hasAlpha ? 'あり' : 'なし'}
          </span>
        </div>
      </div>
      
      {/* テクスチャプレビュー */}
      <div className="mt-4 p-2 bg-gray-800 rounded">
        <p className="text-xs text-gray-400 mb-2">プレビュー:</p>
        <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">3Dシーン内で確認</span>
        </div>
      </div>
      
      {/* 使用状況 */}
      <div className="mt-3 p-2 bg-blue-900/30 rounded text-xs">
        <p className="text-blue-200">📋 適用状況:</p>
        <p>• メインモデルに適用済み</p>
        <p>• 右側のプレーンでテスト表示</p>
        <p>• MTLファイルで自動読み込み</p>
      </div>
    </div>
  );
}; 