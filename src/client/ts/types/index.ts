// ============ Geometry Types ============

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============ Entity Types ============

export interface BallState {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  spin: number;      // Angular velocity (affects curve)
  rotation: number;  // Visual rotation angle
}

export interface PaddleState {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface AIPaddleState extends PaddleState {
  speed: number;
}

export interface DinosaurState {
  sprite: string[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  hitCooldown: number;
}

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  settled?: number;
}

// ============ Game State Types ============

export interface GameState {
  running: boolean;
  playerScore: number;
  aiScore: number;
}

export interface MatchRecord {
  won: boolean;
  playerScore: number;
  aiScore: number;
  date: string;
}

// ============ Config Types ============

export interface GameConfig {
  winningScore: number;
  paddleWidth: number;
  paddleHeight: number;
  ballSize: number;
  initialBallSpeed: number;
  aiSpeed: number;
  dinoSpawnChance: number;
  maxDinosaurs: number;
  maxConfetti: number;
  confettiPerLaunch: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
}

// ============ Sprite Type ============

export type DinoSprite = string[];
