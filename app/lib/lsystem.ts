export interface LSystemRule {
  from: string;
  to: string;
}

export interface LSystemConfig {
  axiom: string;
  rules: LSystemRule[];
  iterations: number;
  angle: number;
  length: number;
  lengthDecay: number;
  thickness: number;
  thicknessDecay: number;
  leafSize: number;
  leafProbability: number;
}

export class LSystem {
  private config: LSystemConfig;
  private currentString: string;

  constructor(config: LSystemConfig) {
    this.config = config;
    this.currentString = config.axiom;
  }

  generate(): string {
    let result = this.config.axiom;
    
    for (let i = 0; i < this.config.iterations; i++) {
      let newResult = '';
      for (const char of result) {
        const rule = this.config.rules.find(r => r.from === char);
        newResult += rule ? rule.to : char;
      }
      result = newResult;
    }
    
    this.currentString = result;
    return result;
  }

  getString(): string {
    return this.currentString;
  }

  static getRandomPlantConfig(): LSystemConfig {
    const configs = [
      // 3D茂み（全方向分岐）
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'F[&+FL][&-FL][^+FL][^-FL]' }
        ],
        iterations: 4,
        angle: 30,
        length: 1.2,
        lengthDecay: 0.75,
        thickness: 0.12,
        thicknessDecay: 0.65,
        leafSize: 0.4,
        leafProbability: 0.9
      },
      // 螺旋状の3D木
      {
        axiom: 'A',
        rules: [
          { from: 'A', to: 'F[\\&AL][/&AL][\\^AL][/^AL]FA' },
          { from: 'F', to: 'FFL' }
        ],
        iterations: 4,
        angle: 25,
        length: 1.0,
        lengthDecay: 0.8,
        thickness: 0.1,
        thicknessDecay: 0.7,
        leafSize: 0.35,
        leafProbability: 0.8
      },
      // 密集した3D分岐
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'FF[&+F\\L][&-F/L][^+F\\L][^-F/L]' }
        ],
        iterations: 3,
        angle: 22.5,
        length: 1.1,
        lengthDecay: 0.7,
        thickness: 0.11,
        thicknessDecay: 0.6,
        leafSize: 0.3,
        leafProbability: 0.85
      },
      // 球状の茂み
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'F[&FL][^FL][+FL][-FL][\\FL][/FL]' }
        ],
        iterations: 3,
        angle: 35,
        length: 0.9,
        lengthDecay: 0.8,
        thickness: 0.09,
        thicknessDecay: 0.75,
        leafSize: 0.45,
        leafProbability: 1.0
      },
      // 複雑な3D構造
      {
        axiom: 'X',
        rules: [
          { from: 'X', to: 'F[&+X\\L][&-X/L]F[^+X\\L][^-X/L]FX' },
          { from: 'F', to: 'FFL' }
        ],
        iterations: 4,
        angle: 28,
        length: 0.85,
        lengthDecay: 0.85,
        thickness: 0.08,
        thicknessDecay: 0.8,
        leafSize: 0.32,
        leafProbability: 0.75
      },
      // 花のような3D構造
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'F[&++FL][&+FL][&FL][&-FL][&--FL][^++FL][^+FL][^FL][^-FL][^--FL]' }
        ],
        iterations: 3,
        angle: 20,
        length: 1.0,
        lengthDecay: 0.75,
        thickness: 0.1,
        thicknessDecay: 0.7,
        leafSize: 0.5,
        leafProbability: 1.0
      },
      // ランダム分岐の3D木
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'F[\\&+FL][/&-FL][\\^+FL][/^-FL]F[+FL][-FL]' }
        ],
        iterations: 4,
        angle: 32,
        length: 1.15,
        lengthDecay: 0.78,
        thickness: 0.105,
        thicknessDecay: 0.68,
        leafSize: 0.38,
        leafProbability: 0.88
      },
      // 垂れ下がる枝の3D木
      {
        axiom: 'F',
        rules: [
          { from: 'F', to: 'F[&F[&FL]][^F[^FL]][+F[+FL]][-F[-FL]]' }
        ],
        iterations: 4,
        angle: 40,
        length: 1.3,
        lengthDecay: 0.72,
        thickness: 0.13,
        thicknessDecay: 0.62,
        leafSize: 0.42,
        leafProbability: 0.92
      }
    ];

    return configs[Math.floor(Math.random() * configs.length)];
  }
} 