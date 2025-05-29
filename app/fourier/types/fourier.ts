export interface FourierCard {
  id: string;
  name: string;
  functionType: 'sin' | 'cos' | 'square' | 'triangle' | 'sawtooth' | 'impulse' | 'gaussian' | 'exponential';
  frequency: number;
  amplitude: number;
  phase: number;
  description: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface FourierCoefficient {
  frequency: number;
  amplitude: number;
  phase: number;
  count: number;
}

export interface GameState {
  coefficients: Map<string, FourierCoefficient>;
  hand: FourierCard[];
  deck: FourierCard[];
  maxHandSize: number;
  totalCards: number;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface FourierTransformResult {
  realSpace: GraphPoint[];
  fourierSpace: GraphPoint[];
  frequencies: number[];
  amplitudes: number[];
  phases: number[];
} 