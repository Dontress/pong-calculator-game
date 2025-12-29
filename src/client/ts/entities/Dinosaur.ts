import { DinosaurState, Rectangle, BallState } from '../types';
import { CANVAS, DINO_SPRITES, DINO_COLORS, PHYSICS } from '../config';

export class Dinosaur implements DinosaurState {
  sprite: string[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  hitCooldown: number;

  constructor() {
    this.sprite = DINO_SPRITES[Math.floor(Math.random() * DINO_SPRITES.length)];
    this.color = DINO_COLORS[Math.floor(Math.random() * DINO_COLORS.length)];

    const goingRight = Math.random() > 0.5;
    this.width = Math.max(...this.sprite.map(row => row.length)) * 6;
    this.height = this.sprite.length * 10;

    this.x = goingRight ? -this.width : CANVAS.width;
    this.y = 30 + Math.random() * (CANVAS.height - 100);
    this.vx = (goingRight ? 1 : -1) * (2 + Math.random() * 3);
    this.hitCooldown = 0;
  }

  getRect(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  update(): void {
    this.x += this.vx;
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }
  }

  isOffScreen(): boolean {
    return (
      (this.vx > 0 && this.x > CANVAS.width + 50) ||
      (this.vx < 0 && this.x < -this.width - 50)
    );
  }

  checkBallCollision(ball: BallState): boolean {
    if (this.hitCooldown > 0) return false;

    return (
      ball.x + ball.size / 2 > this.x &&
      ball.x - ball.size / 2 < this.x + this.width &&
      ball.y + ball.size / 2 > this.y &&
      ball.y - ball.size / 2 < this.y + this.height
    );
  }

  kickBall(ball: BallState): void {
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    const angle = Math.random() * Math.PI * 2;
    ball.vx = Math.cos(angle) * speed * PHYSICS.dinoKickMultiplier;
    ball.vy = Math.sin(angle) * speed * PHYSICS.dinoKickMultiplier;
    ball.x += ball.vx * 2;
    ball.y += ball.vy * 2;
    this.hitCooldown = 30;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    const flipped = this.vx < 0;

    for (let row = 0; row < this.sprite.length; row++) {
      const line = this.sprite[row];
      for (let col = 0; col < line.length; col++) {
        if (line[col] !== ' ') {
          const drawX = flipped
            ? this.x + (line.length - col) * 6
            : this.x + col * 6;
          ctx.fillRect(drawX, this.y + row * 10, 6, 10);
        }
      }
    }
  }
}
