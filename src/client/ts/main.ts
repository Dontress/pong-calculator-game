import { Game } from './Game';
import { Calculator, Storage } from './modules';

// Expose to window for HTML onclick handlers
declare global {
  interface Window {
    appendCalc: (value: string) => void;
    clearCalc: () => void;
    deleteCalc: () => void;
    calculate: () => void;
    launchConfetti: () => void;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize calculator
  const calculator = new Calculator('display');

  // Expose calculator functions to window for onclick handlers
  window.appendCalc = (value: string) => calculator.append(value);
  window.clearCalc = () => calculator.clear();
  window.deleteCalc = () => calculator.delete();
  window.calculate = () => calculator.calculate();

  // Initialize game
  const game = new Game('pong', 'message', 'calculator');

  // Expose confetti launcher
  window.launchConfetti = () => game.launchConfetti();

  // Load initial stats display
  Storage.updateStatsDisplay();
});
