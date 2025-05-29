import { FourierCard } from '../types/fourier';

export const fourierCards: FourierCard[] = [
  // 基本的な三角関数
  {
    id: 'sin-1-basic',
    name: 'サイン波 (基本)',
    functionType: 'sin',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'sin(x) - 最も基本的な正弦波',
    color: '#ff6b6b',
    rarity: 'common'
  },
  {
    id: 'cos-1-basic',
    name: 'コサイン波 (基本)',
    functionType: 'cos',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'cos(x) - 位相が90度ずれた正弦波',
    color: '#4ecdc4',
    rarity: 'common'
  },
  {
    id: 'sin-2-double',
    name: 'サイン波 (2倍波)',
    functionType: 'sin',
    frequency: 2,
    amplitude: 1,
    phase: 0,
    description: 'sin(2x) - 周波数が2倍の正弦波',
    color: '#ff8e8e',
    rarity: 'common'
  },
  {
    id: 'cos-2-double',
    name: 'コサイン波 (2倍波)',
    functionType: 'cos',
    frequency: 2,
    amplitude: 1,
    phase: 0,
    description: 'cos(2x) - 周波数が2倍のコサイン波',
    color: '#6ee0d7',
    rarity: 'common'
  },
  {
    id: 'sin-3-triple',
    name: 'サイン波 (3倍波)',
    functionType: 'sin',
    frequency: 3,
    amplitude: 1,
    phase: 0,
    description: 'sin(3x) - 周波数が3倍の正弦波',
    color: '#ffb3b3',
    rarity: 'rare'
  },
  {
    id: 'cos-3-triple',
    name: 'コサイン波 (3倍波)',
    functionType: 'cos',
    frequency: 3,
    amplitude: 1,
    phase: 0,
    description: 'cos(3x) - 周波数が3倍のコサイン波',
    color: '#8ee8df',
    rarity: 'rare'
  },
  
  // 複雑な波形
  {
    id: 'square-1-basic',
    name: '方形波',
    functionType: 'square',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: '方形波 - 奇数次高調波の合成',
    color: '#ffd93d',
    rarity: 'epic'
  },
  {
    id: 'triangle-1-basic',
    name: '三角波',
    functionType: 'triangle',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: '三角波 - 奇数次高調波の減衰合成',
    color: '#6bcf7f',
    rarity: 'epic'
  },
  {
    id: 'sawtooth-1-basic',
    name: 'のこぎり波',
    functionType: 'sawtooth',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'のこぎり波 - 全高調波の合成',
    color: '#a8e6cf',
    rarity: 'epic'
  },
  
  // 特殊な関数
  {
    id: 'impulse-1-delta',
    name: 'インパルス',
    functionType: 'impulse',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'δ関数 - 全周波数成分を含む',
    color: '#ff9ff3',
    rarity: 'legendary'
  },
  {
    id: 'gaussian-1-bell',
    name: 'ガウシアン',
    functionType: 'gaussian',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'ガウス関数 - 自己フーリエ変換',
    color: '#f368e0',
    rarity: 'legendary'
  },
  {
    id: 'exponential-1-decay',
    name: '指数減衰',
    functionType: 'exponential',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: 'e^(-x) - 指数関数的減衰',
    color: '#ff677d',
    rarity: 'rare'
  }
];

// レアリティ別の出現確率
export const rarityWeights = {
  common: 0.25,    // 50%
  rare: 0.25,     // 25%
  epic: 0.25,     // 12%
  legendary: 0.25 // 13%
};

// ランダムカード抽選（一意のIDを生成）
export const drawRandomCard = (): FourierCard => {
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      const cardsOfRarity = fourierCards.filter(card => card.rarity === rarity);
      const selectedCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      
      // 一意のIDを生成（元のID + タイムスタンプ + ランダム値）
      const uniqueId = `${selectedCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        ...selectedCard,
        id: uniqueId
      };
    }
  }
  
  // フォールバック
  const fallbackCard = fourierCards[0];
  const uniqueId = `${fallbackCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    ...fallbackCard,
    id: uniqueId
  };
}; 