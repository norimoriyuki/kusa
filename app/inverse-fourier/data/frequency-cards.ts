import { FrequencyCard } from '../types/inverse-fourier';

export const frequencyCards: FrequencyCard[] = [
  // Low Frequency Components (Common)
  {
    id: 'freq-0.5-low',
    name: 'Low Bass',
    frequency: 0.5,
    amplitude: 1,
    phase: 0,
    description: '0.5 Hz - Deep bass frequency',
    color: '#1e40af',
    rarity: 'common',
    componentType: 'pure-tone'
  },
  {
    id: 'freq-1-fundamental',
    name: 'Fundamental',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    description: '1 Hz - Fundamental frequency',
    color: '#2563eb',
    rarity: 'common',
    componentType: 'pure-tone'
  },
  {
    id: 'freq-1.5-sub',
    name: 'Sub Harmonic',
    frequency: 1.5,
    amplitude: 0.8,
    phase: 0,
    description: '1.5 Hz - Sub harmonic component',
    color: '#3b82f6',
    rarity: 'common',
    componentType: 'harmonic'
  },

  // Mid Frequency Components (Rare)
  {
    id: 'freq-2-second',
    name: '2nd Harmonic',
    frequency: 2,
    amplitude: 0.7,
    phase: 0,
    description: '2 Hz - Second harmonic',
    color: '#10b981',
    rarity: 'rare',
    componentType: 'harmonic'
  },
  {
    id: 'freq-3-third',
    name: '3rd Harmonic',
    frequency: 3,
    amplitude: 0.5,
    phase: 0,
    description: '3 Hz - Third harmonic',
    color: '#059669',
    rarity: 'rare',
    componentType: 'harmonic'
  },
  {
    id: 'freq-4-fourth',
    name: '4th Harmonic',
    frequency: 4,
    amplitude: 0.4,
    phase: 0,
    description: '4 Hz - Fourth harmonic',
    color: '#0d9488',
    rarity: 'rare',
    componentType: 'harmonic'
  },
  {
    id: 'freq-2.5-off',
    name: 'Off-Harmonic',
    frequency: 2.5,
    amplitude: 0.6,
    phase: Math.PI/4,
    description: '2.5 Hz - Non-harmonic frequency',
    color: '#0891b2',
    rarity: 'rare',
    componentType: 'complex'
  },

  // High Frequency Components (Epic)
  {
    id: 'freq-5-fifth',
    name: '5th Harmonic',
    frequency: 5,
    amplitude: 0.3,
    phase: 0,
    description: '5 Hz - Fifth harmonic',
    color: '#7c3aed',
    rarity: 'epic',
    componentType: 'harmonic'
  },
  {
    id: 'freq-6-sixth',
    name: '6th Harmonic',
    frequency: 6,
    amplitude: 0.25,
    phase: Math.PI/2,
    description: '6 Hz - Sixth harmonic with phase shift',
    color: '#8b5cf6',
    rarity: 'epic',
    componentType: 'harmonic'
  },
  {
    id: 'freq-7-seventh',
    name: '7th Harmonic',
    frequency: 7,
    amplitude: 0.2,
    phase: 0,
    description: '7 Hz - Seventh harmonic',
    color: '#a855f7',
    rarity: 'epic',
    componentType: 'harmonic'
  },
  {
    id: 'freq-8-eighth',
    name: '8th Harmonic',
    frequency: 8,
    amplitude: 0.15,
    phase: Math.PI,
    description: '8 Hz - Eighth harmonic inverted',
    color: '#c084fc',
    rarity: 'epic',
    componentType: 'harmonic'
  },

  // Special Components (Legendary)
  {
    id: 'freq-dc-offset',
    name: 'DC Offset',
    frequency: 0,
    amplitude: 0.5,
    phase: 0,
    description: '0 Hz - DC component (constant offset)',
    color: '#ef4444',
    rarity: 'legendary',
    componentType: 'impulse'
  },
  {
    id: 'freq-10-high',
    name: 'High Frequency',
    frequency: 10,
    amplitude: 0.1,
    phase: 0,
    description: '10 Hz - High frequency component',
    color: '#f97316',
    rarity: 'legendary',
    componentType: 'pure-tone'
  },
  {
    id: 'freq-noise-wide',
    name: 'White Noise',
    frequency: 0,
    amplitude: 0.05,
    phase: 0,
    description: 'Broadband noise component',
    color: '#6b7280',
    rarity: 'legendary',
    componentType: 'noise'
  },
  {
    id: 'freq-complex-beat',
    name: 'Beat Frequency',
    frequency: 1.1,
    amplitude: 0.8,
    phase: Math.PI/3,
    description: '1.1 Hz - Creates beat patterns with fundamental',
    color: '#fbbf24',
    rarity: 'legendary',
    componentType: 'complex'
  }
];

// Rarity-based probability weights
export const rarityWeights = {
  common: 0.4,     // 40%
  rare: 0.3,       // 30%
  epic: 0.2,       // 20%
  legendary: 0.1   // 10%
};

// Weighted random card drawing
export const drawRandomFrequencyCard = (): FrequencyCard => {
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      const cardsOfRarity = frequencyCards.filter(card => card.rarity === rarity);
      const randomIndex = Math.floor(Math.random() * cardsOfRarity.length);
      const selectedCard = cardsOfRarity[randomIndex];
      
      // Create unique ID for each drawn card
      return {
        ...selectedCard,
        id: `${selectedCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    }
  }
  
  // Fallback to first common card
  const commonCards = frequencyCards.filter(card => card.rarity === 'common');
  const selectedCard = commonCards[0];
  return {
    ...selectedCard,
    id: `${selectedCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
}; 