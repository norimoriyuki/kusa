'use client';

interface F451ControlsProps {
  isStarted: boolean;
  onStart: () => void;
}

export function F451Controls({
  isStarted,
  onStart
}: F451ControlsProps) {
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-orange-500/30 min-w-[280px]">
      <h2 className="text-lg font-bold mb-3 text-orange-400">🔥 Fahrenheit 451</h2>
      
      <div className="space-y-3">
        {!isStarted && (
          <button
            onClick={onStart}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            🔥 燃焼開始
          </button>
        )}

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-orange-500/20">
          <h3 className="text-sm font-medium text-orange-300 mb-2">📚 作品について:</h3>
          <div className="text-xs text-orange-200 space-y-1">
            <p>• レイ・ブラッドベリの名作SF小説</p>
            <p>• 華氏451度 = 紙が燃える温度</p>
            <p>• 本を燃やす消防士の物語</p>
            <p>• 検閲と知識の自由をテーマに</p>
          </div>
        </div>

        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-orange-500/20">
          <h3 className="text-sm font-medium text-orange-300 mb-2">🎨 エフェクト:</h3>
          <div className="text-xs text-orange-200 space-y-1">
            <p>• 中央から燃え広がる紙</p>
            <p>• 背景に隠された文字</p>
            <p>• リアルタイム燃焼シミュレーション</p>
            <p>• GLSLシェーダーによる高品質描画</p>
          </div>
        </div>

        <div className="mt-3 text-xs text-orange-400">
          <p><strong>操作:</strong></p>
          <p>• ドラッグ: 回転</p>
          <p>• ホイール: ズーム</p>
        </div>
      </div>
    </div>
  );
} 