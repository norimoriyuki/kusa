import { useState, useCallback, useMemo } from 'react';
import { FourierCard, FourierCoefficient, GameState, GraphPoint, FourierTransformResult } from '../types/fourier';
import { drawRandomCard } from '../data/cards';

export const useFourierGame = () => {
  const [coefficients, setCoefficients] = useState<Map<string, FourierCoefficient>>(new Map());
  const [hand, setHand] = useState<FourierCard[]>([]);

  // カードをドロー
  const drawCard = useCallback(() => {
    if (hand.length < 15) {
      const newCard = drawRandomCard();
      setHand(prev => [...prev, newCard]);
    }
  }, [hand.length]);

  // カードをプレイ
  const playCard = useCallback((card: FourierCard) => {
    const key = `${card.functionType}-${card.frequency}`;
    
    setCoefficients(prev => {
      const newCoefficients = new Map(prev);
      const existing = newCoefficients.get(key);
      
      if (existing) {
        newCoefficients.set(key, {
          ...existing,
          count: existing.count + 1
        });
      } else {
        newCoefficients.set(key, {
          frequency: card.frequency,
          amplitude: card.amplitude,
          phase: card.phase,
          count: 1
        });
      }
      
      return newCoefficients;
    });

    // 手札からカードを削除
    setHand(prev => prev.filter(c => c.id !== card.id));
  }, []);

  // 係数をリセット
  const resetCoefficients = useCallback(() => {
    setCoefficients(new Map());
  }, []);

  // 実空間の関数を計算
  const calculateRealSpace = useCallback((xRange: number[] = []): GraphPoint[] => {
    if (xRange.length === 0) {
      xRange = Array.from({ length: 1000 }, (_, i) => (i - 500) * 0.005);
    }

    return xRange.map(x => {
      let y = 0;
      
      coefficients.forEach((coeff, key) => {
        const [funcType] = key.split('-');
        const amplitude = coeff.amplitude * coeff.count;
        const freq = coeff.frequency;
        const phase = coeff.phase;
        
        switch (funcType) {
          case 'sin':
            y += amplitude * Math.sin(2 * Math.PI * freq * x + phase);
            break;
          case 'cos':
            y += amplitude * Math.cos(2 * Math.PI * freq * x + phase);
            break;
          case 'square':
            // 方形波の正しいフーリエ級数展開
            for (let n = 1; n <= 15; n += 2) {
              y += (amplitude * 4 / Math.PI) * (1/n) * Math.sin(2 * Math.PI * n * freq * x + phase);
            }
            break;
          case 'triangle':
            // 三角波の正しいフーリエ級数展開
            for (let n = 1; n <= 15; n += 2) {
              const sign = Math.pow(-1, (n-1)/2);
              y += (amplitude * 8 / (Math.PI * Math.PI)) * sign * (1/(n*n)) * Math.sin(2 * Math.PI * n * freq * x + phase);
            }
            break;
          case 'sawtooth':
            // のこぎり波の正しいフーリエ級数展開
            for (let n = 1; n <= 20; n++) {
              y += (amplitude * 2 / Math.PI) * Math.pow(-1, n+1) * (1/n) * Math.sin(2 * Math.PI * n * freq * x + phase);
            }
            break;
          case 'impulse':
            // インパルス（デルタ関数）の近似 - 非常に狭いガウシアン
            const sigma = 0.05; // 標準偏差を小さく
            y += amplitude * Math.exp(-Math.pow(x / sigma, 2) / 2) / (sigma * Math.sqrt(2 * Math.PI));
            break;
          case 'gaussian':
            // ガウス関数 - 標準的な形
            const sigma_gauss = 0.5;
            y += amplitude * Math.exp(-Math.pow(x / sigma_gauss, 2) / 2);
            break;
          case 'exponential':
            // 指数減衰関数 - 両側指数
            const lambda = 2;
            y += amplitude * Math.exp(-lambda * Math.abs(x));
            break;
        }
      });
      
      return { x, y };
    });
  }, [coefficients]);

  // フーリエ空間の計算
  const calculateFourierSpace = useCallback((): GraphPoint[] => {
    const frequencies = Array.from({ length: 200 }, (_, i) => i * 0.05); // より細かい周波数分解能
    
    return frequencies.map(freq => {
      let amplitude = 0;
      
      coefficients.forEach((coeff, key) => {
        const [funcType] = key.split('-');
        const baseFreq = coeff.frequency;
        const baseAmp = coeff.amplitude * coeff.count;
        
        switch (funcType) {
          case 'sin':
          case 'cos':
            // 基本周波数のみ
            if (Math.abs(freq - baseFreq) < 0.025) {
              amplitude += baseAmp;
            }
            break;
          case 'square':
            // 奇数次高調波
            for (let n = 1; n <= 15; n += 2) {
              if (Math.abs(freq - n * baseFreq) < 0.025) {
                amplitude += (baseAmp * 4 / Math.PI) * (1/n);
              }
            }
            break;
          case 'triangle':
            // 奇数次高調波（減衰が早い）
            for (let n = 1; n <= 15; n += 2) {
              if (Math.abs(freq - n * baseFreq) < 0.025) {
                amplitude += (baseAmp * 8 / (Math.PI * Math.PI)) * (1/(n*n));
              }
            }
            break;
          case 'sawtooth':
            // 全高調波
            for (let n = 1; n <= 20; n++) {
              if (Math.abs(freq - n * baseFreq) < 0.025) {
                amplitude += (baseAmp * 2 / Math.PI) * (1/n);
              }
            }
            break;
          case 'impulse':
            // インパルスは全周波数に均等に分布
            amplitude += baseAmp * 0.1; // 定数スペクトラム
            break;
          case 'gaussian':
            // ガウス関数のフーリエ変換もガウス関数
            const sigma_freq = 2; // 周波数領域での標準偏差
            amplitude += baseAmp * Math.exp(-Math.pow((freq - baseFreq) / sigma_freq, 2) / 2);
            break;
          case 'exponential':
            // 指数関数のフーリエ変換はローレンツ関数
            // 実空間のλ=2と一致させる
            const lambda_fourier = 2;
            const gamma = lambda_fourier; // γ = λ（理論的関係）
            // 正しい正規化: F(ω) = A × 2λ / (λ² + (ω-ω₀)²)
            const lorentzian = (2 * lambda_fourier) / (lambda_fourier * lambda_fourier + Math.pow(freq - baseFreq, 2));
            amplitude += baseAmp * lorentzian;
            break;
        }
      });
      
      return { x: freq, y: Math.max(0, amplitude) };
    });
  }, [coefficients]);

  // フーリエ変換結果
  const fourierResult: FourierTransformResult = useMemo(() => {
    const realSpace = calculateRealSpace();
    const fourierSpace = calculateFourierSpace();
    
    return {
      realSpace,
      fourierSpace,
      frequencies: Array.from(coefficients.values()).map(c => c.frequency),
      amplitudes: Array.from(coefficients.values()).map(c => c.amplitude * c.count),
      phases: Array.from(coefficients.values()).map(c => c.phase)
    };
  }, [coefficients, calculateRealSpace, calculateFourierSpace]);

  return {
    // 状態
    coefficients,
    hand,
    fourierResult,
    
    // アクション
    drawCard,
    playCard,
    resetCoefficients,
    
    // 計算結果
    calculateRealSpace,
    calculateFourierSpace
  };
}; 