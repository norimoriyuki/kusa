import { create } from 'zustand';
import { CardData, GameState, CardGameActions } from '../types/card';
import { createInitialDeck } from '../data/cards';

interface CardGameStore extends GameState, CardGameActions {}

export const useCardGame = create<CardGameStore>((set, get) => ({
  // 初期状態
  deck: createInitialDeck(),
  hand: [],
  selectedCard: null,
  backgroundColor: '#f8f6f0', 
  isAnimating: false,

  // カードを引く
  drawCard: () => {
    const { deck, hand } = get();
    if (deck.length === 0 || hand.length >= 7) return; // 手札上限7枚

    const newCard = deck[0];
    const remainingDeck = deck.slice(1);
    
    // 手札の扇形配置を計算
    const handPosition = calculateHandPosition(hand.length);
    const cardWithPosition = {
      ...newCard,
      position: handPosition.position,
      rotation: handPosition.rotation
    };

    set({
      deck: remainingDeck,
      hand: [...hand, cardWithPosition],
      isAnimating: true
    });

    // アニメーション完了後
    setTimeout(() => {
      set({ isAnimating: false });
    }, 800);
  },

  // カードを選択
  selectCard: (card: CardData) => {
    const { selectedCard, hand } = get();
    
    if (selectedCard?.id === card.id) {
      // 同じカードを再選択 → アクティベート
      get().activateCard(card);
    } else {
      // 新しいカードを選択
      // 手札全体の位置を更新（選択状態を反映）
      const updatedHand = hand.map((handCard, index) => {
        const isSelected = handCard.id === card.id;
        const newPosition = calculateHandPosition(index, isSelected);
        return {
          ...handCard,
          position: newPosition.position,
          rotation: newPosition.rotation
        };
      });
      
      set({ 
        selectedCard: card,
        hand: updatedHand
      });
    }
  },

  // カードをアクティベート（エフェクト発動）
  activateCard: (card: CardData) => {
    const { effect } = card;
    
    switch (effect.type) {
      case 'background-color':
        get().setBackgroundColor(effect.value);
        break;
      case 'navigation':
        if (card.pageUrl) {
          window.location.href = card.pageUrl;
        }
        break;
      case 'custom':
        // 将来のカスタムエフェクト
        console.log('Custom effect:', effect.value);
        break;
    }

    // エフェクト発動したカードを手札から削除
    const { hand: currentHand } = get();
    const remainingHand = currentHand.filter(handCard => handCard.id !== card.id);
    
    // 残りのカードの位置を再計算
    const updatedHand = remainingHand.map((handCard, index) => {
      const newPosition = calculateHandPosition(index, false);
      return {
        ...handCard,
        position: newPosition.position,
        rotation: newPosition.rotation
      };
    });

    set({ 
      selectedCard: null,
      hand: updatedHand
    });
  },

  // カードを移動
  moveCard: (cardId: string, position: { x: number; y: number; z: number }) => {
    const { hand } = get();
    const updatedHand = hand.map(card =>
      card.id === cardId
        ? { ...card, position }
        : card
    );
    
    set({ hand: updatedHand });
  },

  // 背景色を変更
  setBackgroundColor: (color: string) => {
    set({ backgroundColor: color });
  },

  // ゲームをリセット
  resetGame: () => {
    set({
      deck: createInitialDeck(),
      hand: [],
      selectedCard: null,
      backgroundColor: '#1a1a2e',
      isAnimating: false
    });
  }
}));

// 手札の扇形配置を計算
const calculateHandPosition = (index: number, isSelected: boolean = false) => {
  const totalCards = 7; // 最大手札数
  const fanAngle = Math.PI / 3; // 60度の扇
  const radius = 3;
  const selectedOffset = 0.5; // 選択されたカードのZ軸オフセット
  
  // 中央を0として、左右に配置
  const normalizedIndex = index - (totalCards - 1) / 2;
  const angle = (normalizedIndex / (totalCards - 1)) * fanAngle;
  
  return {
    position: {
      x: Math.sin(angle) * radius, // 左右の配置
      y: 2 - Math.abs(normalizedIndex) * 0.2, // 中央が少し高く
      z: radius + normalizedIndex * 0.01 + (isSelected ? selectedOffset : 0) // 選択されたカードは前に出す
    },
    rotation: {
      x: -0.4,
      y: 0,
      z: -normalizedIndex*0.1  // 上下逆にする
    }
  };
}; 