import { MatchRecord } from '../types';

const STORAGE_KEY = 'pongMatches';
const MAX_MATCHES = 10;

export class Storage {
  static getMatchHistory(): MatchRecord[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  static saveMatch(won: boolean, playerScore: number, aiScore: number): void {
    const matches = this.getMatchHistory();

    matches.unshift({
      won,
      playerScore,
      aiScore,
      date: new Date().toISOString()
    });

    // Keep only last N matches
    if (matches.length > MAX_MATCHES) {
      matches.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }

  static getStats(): { wins: number; losses: number; winRate: number } {
    const matches = this.getMatchHistory();
    const wins = matches.filter(m => m.won).length;
    const losses = matches.filter(m => !m.won).length;
    const total = wins + losses;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return { wins, losses, winRate };
  }

  static updateStatsDisplay(): void {
    const { wins, losses, winRate } = this.getStats();
    const matches = this.getMatchHistory();

    const winsEl = document.getElementById('totalWins');
    const lossesEl = document.getElementById('totalLosses');
    const winRateEl = document.getElementById('winRate');
    const recentList = document.getElementById('recentList');

    if (winsEl) winsEl.textContent = String(wins);
    if (lossesEl) lossesEl.textContent = String(losses);
    if (winRateEl) winRateEl.textContent = `${winRate}%`;

    if (recentList) {
      const recentHtml = matches.slice(0, 5).map(m => {
        const date = new Date(m.date);
        const timeStr = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        const result = m.won ? 'WIN' : 'LOSS';
        const cssClass = m.won ? 'win' : 'loss';
        return `<div class="match ${cssClass}">${result} ${m.playerScore}-${m.aiScore} (${timeStr})</div>`;
      }).join('');

      recentList.innerHTML = recentHtml || '<div class="match">No matches yet</div>';
    }
  }
}
