'use client';

interface GameControlsProps {
  onDraw: () => void;
  onReset: () => void;
  handSize: number;
  maxHandSize: number;
  spectrumSize: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onDraw,
  onReset,
  handSize,
  maxHandSize,
  spectrumSize
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Game Status */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="text-sm text-gray-300">Hand</div>
            <div className="text-xl font-bold">{handSize}/{maxHandSize}</div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="text-sm text-gray-300">Spectrum Components</div>
            <div className="text-xl font-bold text-blue-400">{spectrumSize}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDraw}
            disabled={handSize >= maxHandSize}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${handSize >= maxHandSize 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            🎯 Draw Frequency
          </button>
          
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🔄 Reset Spectrum
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-400 text-center">
        <p>
          🎵 Build a frequency spectrum by playing cards • 
          🌊 Watch the inverse transform create time-domain signals • 
          📊 Learn how frequency components combine!
        </p>
      </div>
    </div>
  );
}; 