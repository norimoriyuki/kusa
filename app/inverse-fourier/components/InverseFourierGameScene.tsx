'use client';

import { useEffect } from 'react';
import { useInverseFourierGame } from '../hooks/useInverseFourierGame';
import { InverseFourierGraph } from './InverseFourierGraph';
import { FrequencyCard } from './FrequencyCard';
import { GameControls } from './GameControls';

export const InverseFourierGameScene: React.FC = () => {
  const {
    spectrum,
    hand,
    inverseFourierResult,
    drawCard,
    playCard,
    resetSpectrum
  } = useInverseFourierGame();

  // Draw initial hand
  useEffect(() => {
    if (hand.length === 0) {
      for (let i = 0; i < 5; i++) {
        drawCard();
      }
    }
  }, [hand.length, drawCard]);

  // Set page title
  useEffect(() => {
    document.title = 'Inverse F-TCG';
  }, []);

  const handleCardPlay = (card: typeof hand[0]) => {
    playCard(card);
  };

  return (
    <div className="min-h-screen p-4 space-y-6 max-w-none w-full">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🔄 Inverse F-TCG: Inverse Fourier Transform Card Game</h1>
      </div>

      {/* Inverse Fourier Transform Graph */}
      <div className="w-full max-w-none px-0">
        <InverseFourierGraph
          frequencyDomainData={inverseFourierResult.frequencyDomain}
          timeDomainData={inverseFourierResult.timeDomain}
        />
      </div>

      {/* Hand Area */}
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg p-6">
          {hand.length === 0 ? (
            <div className="text-center py-8">
              <p>No cards in hand. Draw some frequency cards to start building your spectrum!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {hand.map((card) => (
                <FrequencyCard
                  key={card.id}
                  card={card}
                  isInHand={true}
                  onClick={() => handleCardPlay(card)}
                  onPlay={() => handleCardPlay(card)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="max-w-4xl mx-auto">
        <GameControls
          onDraw={drawCard}
          onReset={resetSpectrum}
          handSize={hand.length}
          maxHandSize={7}
          spectrumSize={spectrum.size}
        />
      </div>

      {/* Current Spectrum Display */}
      {spectrum.size > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📊 Current Frequency Spectrum</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from(spectrum.entries()).map(([key, component]) => (
                <div key={key} className="rounded-lg p-3 border">
                  <div className="text-sm font-semibold text-blue-300">{key}</div>
                  <div className="text-xs">
                    Frequency: {component.frequency} Hz | Amplitude: {component.amplitude} × {component.count}
                  </div>
                  <div className="text-xs">
                    Total: {(component.amplitude * component.count).toFixed(3)}
                  </div>
                  {component.phase !== 0 && (
                    <div className="text-xs">
                      Phase: {(component.phase * 180 / Math.PI).toFixed(1)}°
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learning Tips 
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg p-6 border border-gray-600 bg-gray-800/30">
          <h3 className="text-lg font-semibold mb-3">💡 Learning Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-blue-300">Frequency Cards</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• <span className="text-blue-400">Pure Tones</span>: Single frequency components</li>
                <li>• <span className="text-green-400">Harmonics</span>: Integer multiples of fundamental</li>
                <li>• <span className="text-purple-400">Complex</span>: Non-harmonic frequencies</li>
                <li>• <span className="text-red-400">DC/Noise</span>: Special components</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-300">Inverse Transform</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• <span className="text-blue-400">Input</span>: Frequency domain spectrum</li>
                <li>• <span className="text-green-400">Output</span>: Time domain signal</li>
                <li>• <span className="text-purple-400">Harmonics</span>: Create periodic waveforms</li>
                <li>• <span className="text-yellow-400">Phase</span>: Shifts signal timing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>*/}
    </div>
  );
}; 