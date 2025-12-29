import { PaddleState, AIPaddleState, Rectangle } from '../types';
import { GAME, CANVAS, COLORS } from '../config';

export class Paddle implements PaddleState {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(isPlayer: boolean) {
    this.width = GAME.paddleWidth;
    this.height = GAME.paddleHeight;
    this.y = CANVAS.height / 2 - this.height / 2;

    if (isPlayer) {
      this.x = 30;
      this.color = COLORS.player;
    } else {
      this.x = CANVAS.width - 30 - this.width;
      this.color = COLORS.ai;
    }
  }

  getRect(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  setY(y: number): void {
    this.y = Math.max(0, Math.min(CANVAS.height - this.height, y));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class AIPaddle extends Paddle implements AIPaddleState {
  speed: number;

  constructor() {
    super(false);
    this.speed = GAME.aiSpeed;
  }

  update(ballY: number): void {
    const paddleCenter = this.y + this.height / 2;
    const diff = ballY - paddleCenter;
    const reaction = this.speed * (0.7 + Math.random() * 0.3);

    if (Math.abs(diff) > 10) {
      this.y += diff > 0 ? Math.min(reaction, diff) : -Math.min(reaction, -diff);
    }
    this.y = Math.max(0, Math.min(CANVAS.height - this.height, this.y));
  }
}
