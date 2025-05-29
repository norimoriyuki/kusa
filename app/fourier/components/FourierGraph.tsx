'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { GraphPoint } from '../types/fourier';

interface FourierGraphProps {
  realSpaceData: GraphPoint[];
  fourierSpaceData: GraphPoint[];
}

export const FourierGraph: React.FC<FourierGraphProps> = ({
  realSpaceData,
  fourierSpaceData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // コンテナサイズを監視
  useEffect(() => {
    if (!isClient) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isVerticalLayout = window.innerWidth < 1024; // lg breakpoint
        
        // グラフの実際のサイズを先に計算
        const containerPadding = 48; // コンテナの内側パディング (p-6 = 24px * 2)
        const graphPadding = 32; // グラフエリアの内側パディング (p-4 = 16px * 2)
        const margin = 50; // SVGマージン
        const gap = 24; // グリッドギャップ
        
        const availableWidth = rect.width - containerPadding;
        const availableHeight = window.innerHeight * 0.6; // 画面高さの60%を使用
        
        const graphWidth = isVerticalLayout 
          ? availableWidth - graphPadding - (margin * 2)
          : (availableWidth - gap - (graphPadding * 2) - (margin * 4)) / 2;
        
        const graphHeight = Math.min(
          isVerticalLayout ? (availableHeight - 200) / 2 : availableHeight - 150,
          graphWidth * 0.6 // アスペクト比制限
        );
        
        // コンテナサイズを計算されたグラフサイズに基づいて設定
        const containerWidth = isVerticalLayout
          ? graphWidth + graphPadding + (margin * 2)
          : (graphWidth * 2) + gap + (graphPadding * 2) + (margin * 4);
        
        const containerHeight = isVerticalLayout
          ? (graphHeight * 2) + 200 // タイトル、ギャップ、説明文のスペース
          : graphHeight + 150;
        
        setDimensions({
          width: Math.max(400, containerWidth),
          height: Math.max(300, containerHeight)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isClient]);

  // SVGパスを生成
  const createPath = (data: GraphPoint[], width: number, height: number, xRange: [number, number], yRange: [number, number]) => {
    if (data.length === 0) return '';
    
    const scaleX = (x: number) => ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const scaleY = (y: number) => height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;
    
    let path = `M ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${scaleX(data[i].x)} ${scaleY(data[i].y)}`;
    }
    return path;
  };

  // データの範囲を計算
  const realSpaceXRange = useMemo((): [number, number] => {
    if (realSpaceData.length === 0) return [-10, 10];
    const xValues = realSpaceData.map(p => p.x);
    return [Math.min(...xValues), Math.max(...xValues)];
  }, [realSpaceData]);

  const realSpaceYRange = useMemo((): [number, number] => {
    if (realSpaceData.length === 0) return [-2, 2];
    const yValues = realSpaceData.map(p => p.y);
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const padding = (max - min) * 0.1 || 1;
    return [min - padding, max + padding];
  }, [realSpaceData]);

  const fourierSpaceXRange = useMemo((): [number, number] => {
    if (fourierSpaceData.length === 0) return [0, 10];
    const xValues = fourierSpaceData.map(p => p.x);
    return [0, Math.max(...xValues)];
  }, [fourierSpaceData]);

  const fourierSpaceYRange = useMemo((): [number, number] => {
    if (fourierSpaceData.length === 0) return [0, 2];
    const yValues = fourierSpaceData.map(p => p.y);
    const max = Math.max(...yValues);
    return [0, max * 1.1 || 2];
  }, [fourierSpaceData]);

  // レスポンシブなグラフサイズ（クライアントサイドでのみ計算）
  const isVerticalLayout = isClient ? window.innerWidth < 1024 : false;
  const margin = 50;
  
  // 画面幅に基づいた大きなグラフサイズ（SSR対応）
  const screenWidth = isClient ? window.innerWidth : 1200;
  const graphWidth = isVerticalLayout 
    ? Math.max(400, screenWidth - 100) // 縦並び時は画面幅から100px引く
    : Math.max(300, (screenWidth - 150) / 2); // 横並び時は半分ずつ
  
  const graphHeight = Math.max(250, Math.min(400, graphWidth * 0.6)); // 適切な高さ

  return (
    <div 
      ref={containerRef} 
      className="rounded-lg p-2 w-full"
      style={{ 
        minHeight: '400px',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* 実空間グラフ */}
        <div className="space-y-2 w-full flex flex-col">
          <h3 className="text-lg font-semibold text-center">🌊 実空間 f(x)</h3>
          <div className="rounded-lg p-2 w-full flex-1" style={{ minHeight: '300px' }}>
            <svg 
              width="100%" 
              height="100%"
              viewBox={`0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* グリッド */}
              <defs>
                <pattern id="grid-real" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-real)" />
              
              {/* 軸 */}
              <g transform={`translate(${margin}, ${margin})`}>
                {/* X軸 */}
                <line x1="0" y1={graphHeight/2} x2={graphWidth} y2={graphHeight/2} stroke="#6b7280" strokeWidth="2"/>
                {/* Y軸 */}
                <line x1={graphWidth/2} y1="0" x2={graphWidth/2} y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                
                {/* 軸ラベル */}
                <text x={graphWidth/2} y={graphHeight + 35} textAnchor="middle" fill="#9ca3af" fontSize="14">時間 (x)</text>
                <text x="-35" y={graphHeight/2} textAnchor="middle" fill="#9ca3af" fontSize="14" transform={`rotate(-90, -35, ${graphHeight/2})`}>振幅</text>
                
                {/* データプロット */}
                {realSpaceData.length > 0 && (
                  <path
                    d={createPath(realSpaceData, graphWidth, graphHeight, realSpaceXRange, realSpaceYRange)}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                )}
                
                {/* 目盛り */}
                {[-5, 0, 5].map(x => (
                  <g key={x}>
                    <line 
                      x1={((x - realSpaceXRange[0]) / (realSpaceXRange[1] - realSpaceXRange[0])) * graphWidth} 
                      y1={graphHeight/2 - 5} 
                      x2={((x - realSpaceXRange[0]) / (realSpaceXRange[1] - realSpaceXRange[0])) * graphWidth} 
                      y2={graphHeight/2 + 5} 
                      stroke="#6b7280" 
                    />
                    <text 
                      x={((x - realSpaceXRange[0]) / (realSpaceXRange[1] - realSpaceXRange[0])) * graphWidth} 
                      y={graphHeight/2 + 20} 
                      textAnchor="middle" 
                      fill="#9ca3af" 
                      fontSize="12"
                    >
                      {x}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* フーリエ空間グラフ */}
        <div className="space-y-2 w-full flex flex-col">
          <h3 className="text-lg font-semibold text-center">📊 フーリエ空間 F(ω)</h3>
          <div className="rounded-lg p-2 w-full flex-1" style={{ minHeight: '300px' }}>
            <svg 
              width="100%" 
              height="100%"
              viewBox={`0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* グリッド */}
              <defs>
                <pattern id="grid-fourier" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-fourier)" />
              
              {/* 軸 */}
              <g transform={`translate(${margin}, ${margin})`}>
                {/* X軸 */}
                <line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                {/* Y軸 */}
                <line x1="0" y1="0" x2="0" y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                
                {/* 軸ラベル */}
                <text x={graphWidth/2} y={graphHeight + 35} textAnchor="middle" fill="#9ca3af" fontSize="14">周波数 (ω)</text>
                <text x="-35" y={graphHeight/2} textAnchor="middle" fill="#9ca3af" fontSize="14" transform={`rotate(-90, -35, ${graphHeight/2})`}>振幅</text>
                
                {/* スペクトラム（点表示） */}
                {fourierSpaceData.map((point, i) => {
                  if (point.y === 0) return null;
                  const x = ((point.x - fourierSpaceXRange[0]) / (fourierSpaceXRange[1] - fourierSpaceXRange[0])) * graphWidth;
                  const y = graphHeight - (point.y / fourierSpaceYRange[1]) * graphHeight;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#ef4444"
                      opacity="0.8"
                    />
                  );
                })}
                
                {/* 目盛り */}
                {[0, 2, 4, 6, 8].map(freq => (
                  <g key={freq}>
                    <line 
                      x1={((freq - fourierSpaceXRange[0]) / (fourierSpaceXRange[1] - fourierSpaceXRange[0])) * graphWidth} 
                      y1={graphHeight - 5} 
                      x2={((freq - fourierSpaceXRange[0]) / (fourierSpaceXRange[1] - fourierSpaceXRange[0])) * graphWidth} 
                      y2={graphHeight + 5} 
                      stroke="#6b7280" 
                    />
                    <text 
                      x={((freq - fourierSpaceXRange[0]) / (fourierSpaceXRange[1] - fourierSpaceXRange[0])) * graphWidth} 
                      y={graphHeight + 20} 
                      textAnchor="middle" 
                      fill="#9ca3af" 
                      fontSize="12"
                    >
                      {freq}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}; 