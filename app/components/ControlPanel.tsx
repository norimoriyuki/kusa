'use client';

import { LSystemConfig } from '../lib/lsystem';

interface ControlPanelProps {
  config: LSystemConfig;
  onConfigChange: (config: LSystemConfig) => void;
  onRandomGenerate: () => void;
}

export function ControlPanel({ config, onConfigChange, onRandomGenerate }: ControlPanelProps) {
  const handleIterationsChange = (iterations: number) => {
    onConfigChange({ ...config, iterations: Math.max(1, Math.min(6, iterations)) });
  };

  const handleAngleChange = (angle: number) => {
    onConfigChange({ ...config, angle: Math.max(10, Math.min(90, angle)) });
  };

  const handleLengthChange = (length: number) => {
    onConfigChange({ ...config, length: Math.max(0.1, Math.min(3, length)) });
  };

  const handleThicknessChange = (thickness: number) => {
    onConfigChange({ ...config, thickness: Math.max(0.01, Math.min(0.5, thickness)) });
  };

  const handleLeafSizeChange = (leafSize: number) => {
    onConfigChange({ ...config, leafSize: Math.max(0.1, Math.min(1.0, leafSize)) });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">植物設定</h2>
      
      <div className="space-y-4">
        <button
          onClick={onRandomGenerate}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          🌱 ランダム植物生成
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            反復回数: {config.iterations}
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={config.iterations}
            onChange={(e) => handleIterationsChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>6</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分岐角度: {config.angle.toFixed(1)}°
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="0.1"
            value={config.angle}
            onChange={(e) => handleAngleChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10°</span>
            <span>90°</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            枝の長さ: {config.length.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={config.length}
            onChange={(e) => handleLengthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span>3.0</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            枝の太さ: {config.thickness.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.001"
            value={config.thickness}
            onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.01</span>
            <span>0.5</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🍃 葉のサイズ: {config.leafSize.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            value={config.leafSize}
            onChange={(e) => handleLeafSizeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span>1.0</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">現在のルール:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>開始:</strong> {config.axiom}</div>
            {config.rules.map((rule, index) => (
              <div key={index}>
                <strong>{rule.from}</strong> → {rule.to}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p><strong>記号の意味:</strong></p>
            <p>• F/A: 枝を伸ばす</p>
            <p>• L: 葉を生成</p>
            <p>• +/-: Z軸回転（左右）</p>
            <p>• &/^: X軸回転（上下）</p>
            <p>• \/: Y軸回転（ねじり）</p>
            <p>• [/]: 分岐開始/終了</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p><strong>操作方法:</strong></p>
          <p>• マウスドラッグ: 回転</p>
          <p>• ホイール: ズーム</p>
          <p>• 右クリックドラッグ: パン</p>
        </div>
      </div>
    </div>
  );
} 