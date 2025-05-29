'use client';

import { FrequencyCard as FrequencyCardType } from '../types/inverse-fourier';

interface FrequencyCardProps {
  card: FrequencyCardType;
  isInHand?: boolean;
  onClick?: () => void;
  onPlay?: () => void;
}

export const FrequencyCard: React.FC<FrequencyCardProps> = ({
  card,
  isInHand = false,
  onClick,
  onPlay
}) => {
  const handleClick = () => {
    if (onPlay) {
      onPlay();
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

  const getComponentSymbol = (componentType: string) => {
    switch (componentType) {
      case 'pure-tone': return '∿';
      case 'harmonic': return '≋';
      case 'noise': return '⋯';
      case 'impulse': return '|';
      case 'complex': return '∞';
      default: return '○';
    }
  };

  const getFrequencyDisplayName = (frequency: number, componentType: string) => {
    if (frequency === 0) {
      return componentType === 'impulse' ? 'DC' : 'Noise';
    }
    return `${frequency} Hz`;
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
      {/* Card Header */}
      <div className="p-2 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white">{getFrequencyDisplayName(card.frequency, card.componentType)}</span>
          <span className="text-lg">{getComponentSymbol(card.componentType)}</span>
        </div>
      </div>

      {/* Card Name */}
      <div className="p-2">
        <h3 className="text-sm font-bold text-white leading-tight">{card.name}</h3>
      </div>

      {/* Frequency Information */}
      <div className="px-2 space-y-1">
        <div className="text-xs text-white">
          <span className="font-semibold">Freq:</span> {card.frequency} Hz
        </div>
        <div className="text-xs text-white">
          <span className="font-semibold">Amp:</span> {card.amplitude.toFixed(2)}
        </div>
        {card.phase !== 0 && (
          <div className="text-xs text-white">
            <span className="font-semibold">Phase:</span> {(card.phase * 180 / Math.PI).toFixed(0)}°
          </div>
        )}
      </div>

      {/* Description */}
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-xs text-white leading-tight">{card.description}</p>
      </div>

      {/* Rarity Effects */}
      {card.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-400/20 pointer-events-none animate-pulse" />
      )}
      {card.rarity === 'epic' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 pointer-events-none" />
      )}
    </div>
  );
}; 