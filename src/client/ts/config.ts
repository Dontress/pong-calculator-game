import { GameConfig, CanvasConfig, DinoSprite } from './types';

// ============ Canvas Configuration ============

export const CANVAS: CanvasConfig = {
  width: 900,
  height: 600
};

// ============ Game Configuration ============

export const GAME: GameConfig = {
  winningScore: 5,
  paddleWidth: 12,
  paddleHeight: 100,
  ballSize: 12,
  initialBallSpeed: 6,
  aiSpeed: 4.5,
  dinoSpawnChance: 0.006,
  maxDinosaurs: 3,
  maxConfetti: 50,
  confettiPerLaunch: 12
};

// ============ Colors ============

export const COLORS = {
  background: '#0a0a0a',
  player: '#4ecca3',
  ai: '#e94560',
  ball: '#fff',
  centerLine: '#222',
  calcShadow: 'rgba(22, 33, 62, 0.3)'
} as const;

export const DINO_COLORS = [
  '#ff6b6b',
  '#feca57',
  '#48dbfb',
  '#ff9ff3',
  '#54a0ff',
  '#5f27cd'
] as const;

export const CONFETTI_COLORS = [
  '#ff6b6b',
  '#feca57',
  '#48dbfb',
  '#ff9ff3',
  '#54a0ff',
  '#4ecca3',
  '#e94560'
] as const;

export const CONFETTI_CHARS = [
  '*', '#', '@', '&', '%', '+', '~', '^', '!', '$', 'o', 'x'
] as const;

// ============ Dinosaur Sprites ============

export const DINO_SPRITES: DinoSprite[] = [
  // T-Rex
  [
    "        ██████",
    "       ██▄▄▄██",
    "       ██████",
    "█      ███",
    "██    ████████",
    "███  ██████",
    "████████████",
    " █████████",
    "  ████  ███",
    "  ██     ██"
  ],
  // Stegosaurus
  [
    "      █   █   █",
    "     ██  ██  ██",
    "    ███████████",
    "█▄▄████████████",
    "██████████████",
    " █████████████",
    "  ███      ███",
    "  ██        ██"
  ],
  // Raptor
  [
    "    ████",
    "   ██▄▄██",
    "   █████",
    "    ███",
    "█  ████",
    "██████████",
    " ████████",
    "  ██  ███",
    "  █    ██"
  ]
];

// ============ Physics Constants ============

export const PHYSICS = {
  confettiGravity: 0.15,
  confettiFriction: 0.995,
  confettiBounce: 0.7,
  confettiFloorBounce: 0.6,
  confettiFloorFriction: 0.8,
  confettiSettleThreshold: 0.5,
  confettiSettleTime: 180, // frames (~3 seconds)
  paddleBounceFactor: 1.05,
  calcBounceFactor: 1.02,
  dinoKickMultiplier: 1.3
} as const;
