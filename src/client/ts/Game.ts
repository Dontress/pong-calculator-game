import { Rectangle } from './types';
import { GAME, CANVAS } from './config';
import { Ball, Paddle, AIPaddle, Dinosaur, Confetti } from './entities';
import { Renderer, Storage } from './modules';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private messageEl: HTMLElement;
  private calcEl: HTMLElement;
  private playerScoreEl: HTMLElement;
  private aiScoreEl: HTMLElement;

  private ball: Ball;
  private player: Paddle;
  private ai: AIPaddle;
  private dinosaurs: Dinosaur[] = [];
  private confetti: Confetti[] = [];

  private running: boolean = false;
  private playerScore: number = 0;
  private aiScore: number = 0;

  constructor(canvasId: string, messageId: string, calcId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    const messageEl = document.getElementById(messageId);
    const calcEl = document.getElementById(calcId);
    const playerScoreEl = document.getElementById('playerScore');
    const aiScoreEl = document.getElementById('aiScore');

    if (!canvas || !ctx || !messageEl || !calcEl || !playerScoreEl || !aiScoreEl) {
      throw new Error('Required game elements not found');
    }

    this.canvas = canvas;
    this.renderer = new Renderer(ctx);
    this.messageEl = messageEl;
    this.calcEl = calcEl;
    this.playerScoreEl = playerScoreEl;
    this.aiScoreEl = aiScoreEl;

    this.ball = new Ball();
    this.player = new Paddle(true);
    this.ai = new AIPaddle();

    this.setupEventListeners();
    this.draw();
  }

  private setupEventListeners(): void {
    // Mouse tracking for player paddle - works anywhere on the page
    document.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      this.player.setY(mouseY - GAME.paddleHeight / 2);
    });

    // Space to start
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.running) {
        e.preventDefault();
        this.start();
      }
    });
  }

  private getCalcHitbox(): Rectangle {
    const rect = this.calcEl.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    return {
      x: rect.left - canvasRect.left - 5,
      y: rect.top - canvasRect.top - 5,
      width: rect.width + 10,
      height: rect.height + 10
    };
  }

  start(): void {
    this.running = true;
    this.messageEl.textContent = '';
    this.ball.reset();
    this.gameLoop();
  }

  private gameLoop = (): void => {
    if (this.running) {
      this.update();
    }
    this.draw();
    requestAnimationFrame(this.gameLoop);
  };

  private update(): void {
    this.ball.update();
    this.ai.update(this.ball.y);
    this.updateDinosaurs();
    this.updateConfetti();

    const calc = this.getCalcHitbox();

    // Player paddle collision
    if (this.ball.checkPaddleCollision(this.player.getRect()) && this.ball.vx < 0) {
      this.ball.bounceOffPaddle(this.player.getRect(), GAME.paddleHeight);
    }

    // AI paddle collision
    if (this.ball.checkPaddleCollision(this.ai.getRect()) && this.ball.vx > 0) {
      this.ball.bounceOffPaddle(this.ai.getRect(), GAME.paddleHeight);
    }

    // Calculator collision
    if (this.ball.checkRectCollision(calc)) {
      this.ball.bounceOffRect(calc);
    }

    // Dinosaur collisions
    for (const dino of this.dinosaurs) {
      if (dino.checkBallCollision(this.ball)) {
        dino.kickBall(this.ball);
      }
    }

    // Scoring
    if (this.ball.isOutLeft()) {
      this.aiScore++;
      this.aiScoreEl.textContent = String(this.aiScore);
      this.checkWin();
      this.ball.reset(1);
    } else if (this.ball.isOutRight()) {
      this.playerScore++;
      this.playerScoreEl.textContent = String(this.playerScore);
      this.checkWin();
      this.ball.reset(-1);
    }
  }

  private updateDinosaurs(): void {
    // Spawn new dinosaurs
    if (Math.random() < GAME.dinoSpawnChance && this.dinosaurs.length < GAME.maxDinosaurs) {
      this.dinosaurs.push(new Dinosaur());
    }

    // Update and remove off-screen dinosaurs
    for (let i = this.dinosaurs.length - 1; i >= 0; i--) {
      const dino = this.dinosaurs[i];
      dino.update();

      if (dino.isOffScreen()) {
        this.dinosaurs.splice(i, 1);
      }
    }
  }

  private updateConfetti(): void {
    const calc = this.getCalcHitbox();

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.update();

      // Paddle bounces
      c.bounceOffPaddle(this.player);
      c.bounceOffPaddle(this.ai);

      // Calculator bounce
      c.bounceOffRect(calc);

      // Dinosaur kicks
      for (const dino of this.dinosaurs) {
        c.kickByDinosaur(dino);
      }

      // Ball collision
      c.collideWithBall(this.ball);

      // Remove settled confetti
      if (c.shouldRemove()) {
        this.confetti.splice(i, 1);
      }
    }
  }

  private checkWin(): void {
    if (this.playerScore >= GAME.winningScore) {
      this.running = false;
      this.messageEl.textContent = 'You Win! Press SPACE to play again';
      Storage.saveMatch(true, this.playerScore, this.aiScore);
      Storage.updateStatsDisplay();
      this.resetScores();
    } else if (this.aiScore >= GAME.winningScore) {
      this.running = false;
      this.messageEl.textContent = 'AI Wins! Press SPACE to play again';
      Storage.saveMatch(false, this.playerScore, this.aiScore);
      Storage.updateStatsDisplay();
      this.resetScores();
    }
  }

  private resetScores(): void {
    this.playerScore = 0;
    this.aiScore = 0;
    this.playerScoreEl.textContent = '0';
    this.aiScoreEl.textContent = '0';
  }

  private draw(): void {
    const ctx = this.renderer.getContext();
    const calc = this.getCalcHitbox();

    this.renderer.clear();
    this.renderer.drawCenterLine();

    // Paddles
    this.player.draw(ctx);
    this.ai.draw(ctx);

    // Dinosaurs
    for (const dino of this.dinosaurs) {
      dino.draw(ctx);
    }

    // Confetti
    for (const c of this.confetti) {
      c.draw(ctx);
    }

    // Ball
    this.ball.draw(ctx);

    // Calculator shadow
    this.renderer.drawCalcShadow(calc);
  }

  launchConfetti(): void {
    if (this.confetti.length >= GAME.maxConfetti) return;

    const calc = this.getCalcHitbox();
    const centerX = calc.x + calc.width / 2;
    const centerY = calc.y + calc.height / 2;

    for (let i = 0; i < GAME.confettiPerLaunch; i++) {
      this.confetti.push(new Confetti(centerX, centerY, i, GAME.confettiPerLaunch));
    }
  }
}
