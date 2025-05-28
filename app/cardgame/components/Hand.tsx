'use client';

import { Card } from './Card';
import { useCardGame } from '../hooks/useCardGame';

export const Hand: React.FC = () => {
  const { hand, selectedCard } = useCardGame();

  return (
    <group>
      {hand.map((card) => (
        <Card
          key={card.id}
          card={card}
          isInHand={true}
          isSelected={selectedCard?.id === card.id}
        />
      ))}
    </group>
  );
}; 