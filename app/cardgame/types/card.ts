export interface CardData {
  id: string;
  name: string;
  backgroundColor: string;
  textColor?: string;
  
  // 将来のページ情報用
  pageUrl?: string;
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  
  // エフェクト情報
  effect: {
    type: 'background-color' | 'navigation' | 'custom';
    value: string;
    duration?: number;
  };
  
  // 3D表示用
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
}

export interface GameState {
  deck: CardData[];
  hand: CardData[];
  selectedCard: CardData | null;
  backgroundColor: string;
  isAnimating: boolean;
}

export interface CardGameActions {
  drawCard: () => void;
  selectCard: (card: CardData) => void;
  activateCard: (card: CardData) => void;
  moveCard: (cardId: string, position: { x: number; y: number; z: number }) => void;
  setBackgroundColor: (color: string) => void;
  resetGame: () => void;
} 