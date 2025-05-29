'use client';

import { useEffect } from 'react';
import { useFourierGame } from '../hooks/useFourierGame';
import { FourierGraph } from './FourierGraph';
import { FourierCard } from './FourierCard';
import { GameControls } from './GameControls';

export const FourierGameScene: React.FC = () => {
  const {
    coefficients,
    hand,
    fourierResult,
    drawCard,
    playCard,
    resetCoefficients
  } = useFourierGame();

  // 初期カードをドロー
  useEffect(() => {
    if (hand.length === 0) {
      for (let i = 0; i < 7; i++) {
        drawCard();
      }
    }
  }, [hand.length, drawCard]);

  // ページタイトルを設定
  useEffect(() => {
    document.title = 'F-TCG';
  }, []);

  const handleCardPlay = (card: typeof hand[0]) => {
    playCard(card);
  };

  return (
    <div className="min-h-screen p-4 space-y-6 max-w-none w-full">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">F-TCG: Fourier Transform Card Game</h1>
      </div>

      {/* フーリエ変換グラフ */}
      <div className="w-full max-w-none px-0">
        <FourierGraph
          realSpaceData={fourierResult.realSpace}
          fourierSpaceData={fourierResult.fourierSpace}
        />
      </div>

    {/* 手札エリア */}
    <div className="max-w-6xl mx-auto">
        <div className="rounded-lg p-6">
          {hand.length === 0 ? (
            <div className="text-center py-8">
              <p>手札が空です。ドローボタンでカードを引きましょう！</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {hand.map((card) => (
                <FourierCard
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

            {/* ゲームコントロール */}
            <div className="max-w-4xl mx-auto">
        <GameControls
          onDraw={drawCard}
          onReset={resetCoefficients}
          handSize={hand.length}
          maxHandSize={14}
          coefficientsCount={coefficients.size}
        />
      </div>

      {/* 現在の係数表示 */}
      {coefficients.size > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📊 現在の係数</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from(coefficients.entries()).map(([key, coeff]) => (
                <div key={key} className="rounded-lg p-3 border">
                  <div className="text-sm font-semibold">{key}</div>
                  <div className="text-xs">
                    周波数: {coeff.frequency} | 振幅: {coeff.amplitude} × {coeff.count}
                  </div>
                  <div className="text-xs">
                    合計振幅: {(coeff.amplitude * coeff.count).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 学習ヒント 
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-3">💡 学習のヒント</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">基本的な関数</h4>
              <ul className="space-y-1">
                <li>• サイン波・コサイン波: 純粋な周波数成分</li>
                <li>• 方形波: 奇数次高調波の合成</li>
                <li>• 三角波: 奇数次高調波の減衰合成</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">フーリエ変換の理解</h4>
              <ul className="space-y-1">
                <li>• 実空間: 時間軸での信号の変化</li>
                <li>• フーリエ空間: 周波数成分の分布</li>
                <li>• 複雑な波形は単純な波の重ね合わせ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>*/}
    </div>
  );
}; 