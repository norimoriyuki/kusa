'use client';

interface GameControlsProps {
  onDraw: () => void;
  onReset: () => void;
  handSize: number;
  maxHandSize: number;
  coefficientsCount: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onDraw,
  onReset,
  handSize,
  maxHandSize,
  coefficientsCount
}) => {
  return (
    <div className="rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* ゲーム情報 */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-semibold">手札:</span> {handSize}/{maxHandSize}
          </div>
          <div className="text-sm">
            <span className="font-semibold">係数:</span> {coefficientsCount}
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex gap-3">
          <button
            onClick={onDraw}
            disabled={handSize >= maxHandSize}
            className={`
              px-6 py-2 rounded-lg font-bold transition-all duration-200
              ${handSize >= maxHandSize 
                ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
              }
            `}
          >
            🎴 ドロー
          </button>

          <button
            onClick={onReset}
            disabled={coefficientsCount === 0}
            className={`
              px-6 py-2 rounded-lg font-bold transition-all duration-200
              ${coefficientsCount === 0
                ? 'bg-gray-500 cursor-not-allowed opacity-50'
                : 'bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95'
              }
            `}
          >
            🔄 リセット
          </button>
        </div>
      </div>

      {/* 進行状況バー */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>{handSize}/{maxHandSize}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(handSize / maxHandSize) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 