import { CardData } from '../types/card';

// 美しい色のパレットを生成（HSL使用）
const generateColorPalette = (count: number): string[] => {
  const colors: string[] = [];
  const goldenAngle = 137.508; // 黄金角
  
  for (let i = 0; i < count; i++) {
    const hue = (i * goldenAngle) % 360;
    const saturation = 70 + (i % 3) * 10; // 70-90%
    const lightness = 45 + (i % 4) * 10;  // 45-75%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
};

// カラーネームを生成
const generateColorNames = (): string[] => [
  'Crimson Fire', 'Ocean Deep', 'Forest Whisper', 'Golden Dawn',
  'Purple Haze', 'Emerald Dream', 'Sunset Glow', 'Midnight Blue',
  'Rose Petal', 'Lime Burst', 'Coral Reef', 'Lavender Mist',
  'Amber Light', 'Teal Wave', 'Cherry Blossom', 'Sage Green',
  'Ruby Red', 'Sky Blue', 'Peach Soft', 'Mint Fresh',
  'Violet Storm', 'Copper Shine', 'Aqua Marine', 'Honey Gold',
  'Magenta Bright', 'Olive Branch', 'Pink Flamingo', 'Turquoise',
  'Orange Zest', 'Indigo Night', 'Lime Green', 'Burgundy',
  'Cyan Electric', 'Maroon Deep', 'Yellow Sun', 'Navy Storm',
  'Fuchsia Pop', 'Brown Earth', 'Silver Moon', 'Black Diamond'
];

export const createInitialDeck = (): CardData[] => {
  const colors = generateColorPalette(40);
  const names = generateColorNames();
  
  return colors.map((color, index) => ({
    id: `card-${index + 1}`,
    name: names[index],
    backgroundColor: color,
    textColor: '#ffffff',
    effect: {
      type: 'background-color' as const,
      value: color,
      duration: 1000
    },
    position: {
      x: 0,
      y: 2,
      z: -index * 0.01 // デッキでの重なり
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    },
    scale: 1
  }));
};

// 将来のページカード例
export const createPageCard = (
  pageUrl: string,
  pageTitle: string,
  pageDescription: string,
  backgroundColor: string = '#4a90e2'
): CardData => ({
  id: `page-${Date.now()}`,
  name: pageTitle,
  backgroundColor,
  textColor: '#ffffff',
  pageUrl,
  pageTitle,
  pageDescription,
  effect: {
    type: 'navigation',
    value: pageUrl
  },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1
}); 