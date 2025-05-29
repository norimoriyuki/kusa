'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { DataPoint } from '../types/inverse-fourier';

interface InverseFourierGraphProps {
  frequencyDomainData: DataPoint[];
  timeDomainData: DataPoint[];
}

export const InverseFourierGraph: React.FC<InverseFourierGraphProps> = ({
  frequencyDomainData,
  timeDomainData
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Client-side only execution
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Container size monitoring
  useEffect(() => {
    if (!isClient) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        // Note: Dimension calculations removed as they are not currently used
        // This effect is kept for potential future responsive features
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isClient]);

  // SVG path generation
  const createPath = (data: DataPoint[], width: number, height: number, xRange: [number, number], yRange: [number, number]) => {
    if (data.length === 0) return '';
    
    const scaleX = (x: number) => ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const scaleY = (y: number) => height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;
    
    let path = `M ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${scaleX(data[i].x)} ${scaleY(data[i].y)}`;
    }
    return path;
  };

  // Calculate data ranges
  const frequencyXRange = useMemo((): [number, number] => {
    if (frequencyDomainData.length === 0) return [0, 12];
    const xValues = frequencyDomainData.map(p => p.x);
    return [0, Math.max(...xValues)];
  }, [frequencyDomainData]);

  const frequencyYRange = useMemo((): [number, number] => {
    if (frequencyDomainData.length === 0) return [0, 2];
    const yValues = frequencyDomainData.map(p => p.y);
    const max = Math.max(...yValues);
    return [0, max * 1.1 || 2];
  }, [frequencyDomainData]);

  const timeXRange = useMemo((): [number, number] => {
    if (timeDomainData.length === 0) return [-5, 5];
    const xValues = timeDomainData.map(p => p.x);
    return [Math.min(...xValues), Math.max(...xValues)];
  }, [timeDomainData]);

  const timeYRange = useMemo((): [number, number] => {
    if (timeDomainData.length === 0) return [-2, 2];
    const yValues = timeDomainData.map(p => p.y);
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const padding = (max - min) * 0.1 || 1;
    return [min - padding, max + padding];
  }, [timeDomainData]);

  // Responsive graph sizing (SSR compatible)
  const isVerticalLayout = isClient ? window.innerWidth < 1024 : false;
  const margin = 50;
  
  // Screen width based graph sizing
  const screenWidth = isClient ? window.innerWidth : 1200;
  const graphWidth = isVerticalLayout 
    ? Math.max(400, screenWidth - 100)
    : Math.max(300, (screenWidth - 150) / 2);
  
  const graphHeight = Math.max(250, Math.min(400, graphWidth * 0.6));

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
      <h2 className="text-2xl font-bold mb-4 text-center">Inverse Fourier Transform</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Frequency Domain Graph (Input) */}
        <div className="space-y-2 w-full flex flex-col">
          <h3 className="text-lg font-semibold text-center">📊 Frequency Domain F(ω) → Input</h3>
          <div className="rounded-lg p-2 w-full flex-1" style={{ minHeight: '300px' }}>
            <svg 
              width="100%" 
              height="100%"
              viewBox={`0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid-frequency" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-frequency)" />
              
              {/* Axes */}
              <g transform={`translate(${margin}, ${margin})`}>
                {/* X-axis */}
                <line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                {/* Y-axis */}
                <line x1="0" y1="0" x2="0" y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                
                {/* Axis labels */}
                <text x={graphWidth/2} y={graphHeight + 35} textAnchor="middle" fill="#9ca3af" fontSize="14">Frequency (Hz)</text>
                <text x="-35" y={graphHeight/2} textAnchor="middle" fill="#9ca3af" fontSize="14" transform={`rotate(-90, -35, ${graphHeight/2})`}>Amplitude</text>
                
                {/* Spectrum (bar chart style) */}
                {frequencyDomainData.map((point, i) => {
                  if (point.y === 0) return null;
                  const x = ((point.x - frequencyXRange[0]) / (frequencyXRange[1] - frequencyXRange[0])) * graphWidth;
                  const y = graphHeight - (point.y / frequencyYRange[1]) * graphHeight;
                  const barHeight = (point.y / frequencyYRange[1]) * graphHeight;
                  return (
                    <rect
                      key={i}
                      x={x - 2}
                      y={y}
                      width="4"
                      height={barHeight}
                      fill="#ef4444"
                      opacity="0.8"
                    />
                  );
                })}
                
                {/* Tick marks */}
                {[0, 2, 4, 6, 8, 10].map(freq => (
                  <g key={freq}>
                    <line 
                      x1={((freq - frequencyXRange[0]) / (frequencyXRange[1] - frequencyXRange[0])) * graphWidth} 
                      y1={graphHeight - 5} 
                      x2={((freq - frequencyXRange[0]) / (frequencyXRange[1] - frequencyXRange[0])) * graphWidth} 
                      y2={graphHeight + 5} 
                      stroke="#6b7280" 
                    />
                    <text 
                      x={((freq - frequencyXRange[0]) / (frequencyXRange[1] - frequencyXRange[0])) * graphWidth} 
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

        {/* Time Domain Graph (Output) */}
        <div className="space-y-2 w-full flex flex-col">
          <h3 className="text-lg font-semibold text-center">🌊 Time Domain f(t) ← Output</h3>
          <div className="rounded-lg p-2 w-full flex-1" style={{ minHeight: '300px' }}>
            <svg 
              width="100%" 
              height="100%"
              viewBox={`0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid-time" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-time)" />
              
              {/* Axes */}
              <g transform={`translate(${margin}, ${margin})`}>
                {/* X-axis */}
                <line x1="0" y1={graphHeight/2} x2={graphWidth} y2={graphHeight/2} stroke="#6b7280" strokeWidth="2"/>
                {/* Y-axis */}
                <line x1={graphWidth/2} y1="0" x2={graphWidth/2} y2={graphHeight} stroke="#6b7280" strokeWidth="2"/>
                
                {/* Axis labels */}
                <text x={graphWidth/2} y={graphHeight + 35} textAnchor="middle" fill="#9ca3af" fontSize="14">Time (s)</text>
                <text x="-35" y={graphHeight/2} textAnchor="middle" fill="#9ca3af" fontSize="14" transform={`rotate(-90, -35, ${graphHeight/2})`}>Amplitude</text>
                
                {/* Signal plot */}
                {timeDomainData.length > 0 && (
                  <path
                    d={createPath(timeDomainData, graphWidth, graphHeight, timeXRange, timeYRange)}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                )}
                
                {/* Tick marks */}
                {[-4, -2, 0, 2, 4].map(time => (
                  <g key={time}>
                    <line 
                      x1={((time - timeXRange[0]) / (timeXRange[1] - timeXRange[0])) * graphWidth} 
                      y1={graphHeight/2 - 5} 
                      x2={((time - timeXRange[0]) / (timeXRange[1] - timeXRange[0])) * graphWidth} 
                      y2={graphHeight/2 + 5} 
                      stroke="#6b7280" 
                    />
                    <text 
                      x={((time - timeXRange[0]) / (timeXRange[1] - timeXRange[0])) * graphWidth} 
                      y={graphHeight/2 + 20} 
                      textAnchor="middle" 
                      fill="#9ca3af" 
                      fontSize="12"
                    >
                      {time}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="mt-6 text-sm text-gray-300 text-center">
        <p>Left: Frequency spectrum (input) | Right: Time-domain signal (output)</p>
        <p>Play frequency cards to build spectrum and see the inverse transform!</p>
      </div>
    </div>
  );
}; 