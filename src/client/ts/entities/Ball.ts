import { BallState, Rectangle } from '../types';
import { GAME, CANVAS, COLORS, PHYSICS } from '../config';

export class Ball implements BallState {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  spin: number;      // Angular velocity - positive = topspin, negative = backspin
  rotation: number;  // Visual rotation angle in radians

  constructor() {
    this.x = CANVAS.width / 2;
    this.y = CANVAS.height / 2;
    this.size = GAME.ballSize;
    this.vx = GAME.initialBallSpeed;
    this.vy = 0;
    this.color = COLORS.ball;
    this.spin = 0;
    this.rotation = 0;
  }

  reset(direction: number = 1): void {
    this.x = CANVAS.width / 2;
    this.y = CANVAS.height / 2 + (Math.random() > 0.5 ? 150 : -150);
    this.vx = GAME.initialBallSpeed * direction;
    this.vy = (Math.random() - 0.5) * 4;
    this.spin = 0;
    this.rotation = 0;
  }

  update(): void {
    // Apply Magnus effect - spin curves the ball
    this.vy += this.spin * PHYSICS.magnusStrength;

    // Move ball
    this.x += this.vx;
    this.y += this.vy;

    // Spin decay (friction)
    this.spin *= PHYSICS.spinDecay;

    // Update visual rotation based on velocity and spin
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.rotation += (speed / 10 + Math.abs(this.spin)) * PHYSICS.rotationVisualSpeed * Math.sign(this.vx);

    // Wall bounce (top/bottom)
    if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= CANVAS.height) {
      this.vy *= -1;
      this.y = Math.max(this.size / 2, Math.min(CANVAS.height - this.size / 2, this.y));
      // Wall contact reduces spin
      this.spin *= PHYSICS.wallSpinReduction;
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
    // Calculate contact offset from paddle center (-1 to 1)
    const contactOffset = (this.y - (paddle.y + paddleHeight / 2)) / (paddleHeight / 2);

    // Apply spin based on contact position
    // Hit near edges = more spin, center = less spin
    const newSpin = contactOffset * PHYSICS.paddleSpinFactor * Math.abs(this.vx);
    this.spin = Math.max(-PHYSICS.maxSpin, Math.min(PHYSICS.maxSpin, this.spin + newSpin));

    // Bounce velocity
    this.vx *= -PHYSICS.paddleBounceFactor;
    this.vy = contactOffset * 6;

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
      // Side collision adds some spin
      this.spin += this.vy * 0.01;
    } else {
      this.vy *= -PHYSICS.calcBounceFactor;
      this.y += minOverlap === overlapTop ? -overlapTop : overlapBottom;
      // Top/bottom collision reduces spin
      this.spin *= PHYSICS.wallSpinReduction;
    }

    // Clamp spin
    this.spin = Math.max(-PHYSICS.maxSpin, Math.min(PHYSICS.maxSpin, this.spin));
  }

  isOutLeft(): boolean {
    return this.x < 0;
  }

  isOutRight(): boolean {
    return this.x > CANVAS.width;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw ball
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw spin indicator line (shows rotation)
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size / 2 - 1, 0);
    ctx.stroke();

    // Draw second indicator for better visibility
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-this.size / 2 + 1, 0);
    ctx.stroke();

    ctx.restore();
  }
}
