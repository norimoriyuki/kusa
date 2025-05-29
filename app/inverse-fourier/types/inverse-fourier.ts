export interface FrequencyCard {
  id: string;
  name: string;
  frequency: number;
  amplitude: number;
  phase: number;
  description: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  componentType: 'pure-tone' | 'harmonic' | 'noise' | 'impulse' | 'complex';
}

export interface FrequencyComponent {
  frequency: number;
  amplitude: number;
  phase: number;
  count: number;
}

export interface GameState {
  spectrum: Map<string, FrequencyComponent>;
  hand: FrequencyCard[];
  deck: FrequencyCard[];
  maxHandSize: number;
  totalCards: number;
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface InverseFourierResult {
  frequencyDomain: DataPoint[];
  timeDomain: DataPoint[];
  frequencies: number[];
  amplitudes: number[];
  phases: number[];
} 