'use client';

interface FireControlsProps {
  burnSpeed: number;
  onBurnSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export function FireControls({
  burnSpeed,
  onBurnSpeedChange,
  onReset
}: FireControlsProps) {
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-500/30">
      <h2 className="text-xl font-bold mb-4 text-orange-400">🔥 燃焼制御</h2>
      
      <div className="space-y-4">
        <button
          onClick={onReset}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          🔄 リセット
        </button>

        <div>
          <label className="block text-sm font-medium text-orange-300 mb-2">
            燃焼速度: {burnSpeed.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={burnSpeed}
            onChange={(e) => onBurnSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-orange"
          />
          <div className="flex justify-between text-xs text-orange-400 mt-1">
            <span>遅い</span>
            <span>速い</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-orange-500/20">
          <h3 className="text-sm font-medium text-orange-300 mb-2">シェーダー情報:</h3>
          <div className="text-xs text-orange-200 space-y-1">
            <p>• カスタムGLSLシェーダー使用</p>
            <p>• リアルタイムノイズ生成</p>
            <p>• 動的な燃焼境界</p>
            <p>• 炎の揺らぎエフェクト</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-orange-400">
          <p><strong>操作方法:</strong></p>
          <p>• マウスドラッグ: 自由回転（縦横）</p>
          <p>• ホイール: ズーム</p>
          <p>• 右クリックドラッグ: パン</p>
        </div>
      </div>

      <style jsx>{`
        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          border: 2px solid #fff;
        }
        
        .slider-orange::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
} 