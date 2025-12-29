import { Rectangle } from '../types';
import { CANVAS, COLORS } from '../config';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  }

  drawCenterLine(): void {
    this.ctx.setLineDash([10, 10]);
    this.ctx.strokeStyle = COLORS.centerLine;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS.width / 2, 0);
    this.ctx.lineTo(CANVAS.width / 2, CANVAS.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawCalcShadow(calc: Rectangle): void {
    this.ctx.fillStyle = COLORS.calcShadow;
    this.ctx.fillRect(calc.x, calc.y, calc.width, calc.height);
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
