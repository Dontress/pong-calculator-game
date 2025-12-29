import { BallState, Rectangle } from '../types';
import { GAME, CANVAS, COLORS, PHYSICS } from '../config';

export class Ball implements BallState {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;

  constructor() {
    this.x = CANVAS.width / 2;
    this.y = CANVAS.height / 2;
    this.size = GAME.ballSize;
    this.vx = GAME.initialBallSpeed;
    this.vy = 0;
    this.color = COLORS.ball;
  }

  reset(direction: number = 1): void {
    this.x = CANVAS.width / 2;
    this.y = CANVAS.height / 2 + (Math.random() > 0.5 ? 150 : -150);
    this.vx = GAME.initialBallSpeed * direction;
    this.vy = (Math.random() - 0.5) * 4;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    // Wall bounce (top/bottom)
    if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= CANVAS.height) {
      this.vy *= -1;
      this.y = Math.max(this.size / 2, Math.min(CANVAS.height - this.size / 2, this.y));
    }
  }

  checkPaddleCollision(paddle: Rectangle): boolean {
    return (
      this.x - this.size / 2 < paddle.x + paddle.width &&
      this.x + this.size / 2 > paddle.x &&
      this.y - this.size / 2 < paddle.y + paddle.height &&
      this.y + this.size / 2 > paddle.y
    );
  }

  bounceOffPaddle(paddle: Rectangle, paddleHeight: number): void {
    this.vx *= -PHYSICS.paddleBounceFactor;
    this.vy = ((this.y - (paddle.y + paddleHeight / 2)) / (paddleHeight / 2)) * 6;

    // Push ball out of paddle
    if (this.vx > 0) {
      this.x = paddle.x + paddle.width + this.size / 2;
    } else {
      this.x = paddle.x - this.size / 2;
    }
  }

  checkRectCollision(rect: Rectangle): boolean {
    return (
      this.x + this.size / 2 > rect.x &&
      this.x - this.size / 2 < rect.x + rect.width &&
      this.y + this.size / 2 > rect.y &&
      this.y - this.size / 2 < rect.y + rect.height
    );
  }

  bounceOffRect(rect: Rectangle): void {
    const ballLeft = this.x - this.size / 2;
    const ballRight = this.x + this.size / 2;
    const ballTop = this.y - this.size / 2;
    const ballBottom = this.y + this.size / 2;

    const overlapLeft = ballRight - rect.x;
    const overlapRight = rect.x + rect.width - ballLeft;
    const overlapTop = ballBottom - rect.y;
    const overlapBottom = rect.y + rect.height - ballTop;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapLeft || minOverlap === overlapRight) {
      this.vx *= -PHYSICS.calcBounceFactor;
      this.x += minOverlap === overlapLeft ? -overlapLeft : overlapRight;
    } else {
      this.vy *= -PHYSICS.calcBounceFactor;
      this.y += minOverlap === overlapTop ? -overlapTop : overlapBottom;
    }
  }

  isOutLeft(): boolean {
    return this.x < 0;
  }

  isOutRight(): boolean {
    return this.x > CANVAS.width;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
