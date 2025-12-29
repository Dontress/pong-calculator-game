import { ConfettiParticle, Rectangle, BallState, PaddleState, DinosaurState } from '../types';
import { CANVAS, CONFETTI_CHARS, CONFETTI_COLORS, PHYSICS } from '../config';

export class Confetti implements ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  settled: number;

  constructor(centerX: number, centerY: number, index: number, total: number) {
    const angle = (Math.PI * 2 * index) / total + Math.random() * 0.3;
    const speed = 4 + Math.random() * 6;

    this.x = centerX;
    this.y = centerY;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.char = CONFETTI_CHARS[Math.floor(Math.random() * CONFETTI_CHARS.length)];
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 20;
    this.size = 12 + Math.random() * 8;
    this.settled = 0;
  }

  update(): void {
    // Gravity
    this.vy += PHYSICS.confettiGravity;

    // Move
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Friction
    this.vx *= PHYSICS.confettiFriction;

    // Bounce off walls
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -PHYSICS.confettiBounce;
    }
    if (this.x > CANVAS.width) {
      this.x = CANVAS.width;
      this.vx *= -PHYSICS.confettiBounce;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -PHYSICS.confettiBounce;
    }

    // Bounce off floor
    if (this.y > CANVAS.height - 10) {
      this.y = CANVAS.height - 10;
      this.vy *= -PHYSICS.confettiFloorBounce;
      this.vx *= PHYSICS.confettiFloorFriction;
      if (Math.abs(this.vy) < PHYSICS.confettiSettleThreshold) {
        this.vy = 0;
      }
    }

    // Track settling
    if (this.y >= CANVAS.height - 12 && Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
      this.settled++;
    }
  }

  bounceOffPaddle(paddle: PaddleState): void {
    if (
      this.x < paddle.x + paddle.width &&
      this.x > paddle.x &&
      this.y > paddle.y &&
      this.y < paddle.y + paddle.height
    ) {
      if (paddle.x < CANVAS.width / 2) {
        // Player paddle (left)
        this.x = paddle.x + paddle.width;
        this.vx = Math.abs(this.vx) * 1.2;
      } else {
        // AI paddle (right)
        this.x = paddle.x - 5;
        this.vx = -Math.abs(this.vx) * 1.2;
      }
    }
  }

  bounceOffRect(rect: Rectangle): void {
    if (
      this.x > rect.x &&
      this.x < rect.x + rect.width &&
      this.y > rect.y &&
      this.y < rect.y + rect.height
    ) {
      const fromLeft = this.x - rect.x;
      const fromRight = rect.x + rect.width - this.x;
      const fromTop = this.y - rect.y;
      const fromBottom = rect.y + rect.height - this.y;
      const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);

      if (min === fromLeft) {
        this.x = rect.x;
        this.vx = -Math.abs(this.vx);
      } else if (min === fromRight) {
        this.x = rect.x + rect.width;
        this.vx = Math.abs(this.vx);
      } else if (min === fromTop) {
        this.y = rect.y;
        this.vy = -Math.abs(this.vy);
      } else {
        this.y = rect.y + rect.height;
        this.vy = Math.abs(this.vy);
      }
    }
  }

  kickByDinosaur(dino: DinosaurState): void {
    if (
      this.x > dino.x &&
      this.x < dino.x + dino.width &&
      this.y > dino.y &&
      this.y < dino.y + dino.height
    ) {
      const kickAngle = Math.random() * Math.PI * 2;
      const kickSpeed = 8 + Math.random() * 5;
      this.vx = Math.cos(kickAngle) * kickSpeed;
      this.vy = Math.sin(kickAngle) * kickSpeed - 3;
    }
  }

  collideWithBall(ball: BallState): void {
    const dx = this.x - ball.x;
    const dy = this.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < ball.size / 2 + 8) {
      const angle = Math.atan2(dy, dx);
      this.vx = Math.cos(angle) * 5;
      this.vy = Math.sin(angle) * 5;
      // Ball gets a small push back
      ball.vx += Math.cos(angle + Math.PI) * 0.5;
      ball.vy += Math.sin(angle + Math.PI) * 0.5;
    }
  }

  shouldRemove(): boolean {
    return this.settled > PHYSICS.confettiSettleTime;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
  }
}
