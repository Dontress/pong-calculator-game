export class Calculator {
  private input: string = '0';
  private displayEl: HTMLElement;

  constructor(displayElementId: string) {
    const el = document.getElementById(displayElementId);
    if (!el) throw new Error(`Calculator display element '${displayElementId}' not found`);
    this.displayEl = el;
    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.displayEl.textContent = this.input;
  }

  append(value: string): void {
    if (this.input === '0' && value !== '.') {
      this.input = value;
    } else {
      this.input += value;
    }
    this.updateDisplay();
  }

  clear(): void {
    this.input = '0';
    this.updateDisplay();
  }

  delete(): void {
    this.input = this.input.slice(0, -1) || '0';
    this.updateDisplay();
  }

  calculate(): void {
    try {
      // Using Function constructor instead of eval for slightly better security
      const result = new Function(`return ${this.input}`)();
      this.input = String(result);
      this.updateDisplay();
    } catch {
      this.input = 'Error';
      this.updateDisplay();
    }
  }
}
