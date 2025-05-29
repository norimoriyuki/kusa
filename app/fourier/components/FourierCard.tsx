'use client';

import { FourierCard as FourierCardType } from '../types/fourier';

interface FourierCardProps {
  card: FourierCardType;
  isInHand?: boolean;
  onClick?: () => void;
  onPlay?: () => void;
}

export const FourierCard: React.FC<FourierCardProps> = ({
  card,
  isInHand = false,
  onClick,
  onPlay
}) => {
  const handleClick = () => {
    if (onPlay) {
      onPlay(); // 即座にプレイ
    } else if (onClick) {
      onClick();
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-100';
      case 'rare': return 'border-blue-400 bg-blue-100';
      case 'epic': return 'border-purple-400 bg-purple-100';
      case 'legendary': return 'border-yellow-400 bg-yellow-100';
      default: return 'border-gray-400 bg-gray-100';
    }
  };

  const getFunctionSymbol = (functionType: string) => {
    switch (functionType) {
      case 'sin': return '∿';
      case 'cos': return '∿';
      case 'square': return '⊓';
      case 'triangle': return '△';
      case 'sawtooth': return '⟋';
      case 'impulse': return '|';
      case 'gaussian': return '⌒';
      case 'exponential': return 'e⁻ˣ';
      default: return '?';
    }
  };

  const getFunctionDisplayName = (functionType: string) => {
    switch (functionType) {
      case 'sin': return 'sin(x)';
      case 'cos': return 'cos(x)';
      case 'square': return 'square(x)';
      case 'triangle': return 'triangle(x)';
      case 'sawtooth': return 'sawtooth(x)';
      case 'impulse': return 'δ(x)';
      case 'gaussian': return 'gauss(x)';
      case 'exponential': return 'exp(-x)';
      default: return 'f(x)';
    }
  };

  return (
    <div
      className={`
        relative w-32 h-44 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${getRarityColor(card.rarity)}
        ${isInHand ? 'hover:scale-105 hover:shadow-lg' : ''}
      `}
      style={{ backgroundColor: card.color + '20' }}
      onClick={handleClick}
    >
      {/* カードヘッダー */}
      <div className="p-2 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white">{getFunctionDisplayName(card.functionType)}</span>
          <span className="text-lg">{getFunctionSymbol(card.functionType)}</span>
        </div>
      </div>

      {/* カード名 */}
      <div className="p-2">
        <h3 className="text-sm font-bold text-white leading-tight">{card.name}</h3>
      </div>

      {/* 関数情報 */}
      <div className="px-2 space-y-1">
        <div className="text-xs text-white">
          <span className="font-semibold">周波数:</span> {card.frequency}
        </div>
        <div className="text-xs text-white">
          <span className="font-semibold">振幅:</span> {card.amplitude}
        </div>
        {card.phase !== 0 && (
          <div className="text-xs text-white">
            <span className="font-semibold">位相:</span> {card.phase}
          </div>
        )}
      </div>

      {/* 説明 */}
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-xs text-white leading-tight">{card.description}</p>
      </div>

      {/* レアリティ装飾 */}
      {card.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-400/20 pointer-events-none animate-pulse" />
      )}
      {card.rarity === 'epic' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 pointer-events-none" />
      )}
    </div>
  );
}; 