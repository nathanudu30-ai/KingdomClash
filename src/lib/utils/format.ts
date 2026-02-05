/**
 * Formate un nombre en notation compacte (1.2M, 500K, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

/**
 * Formate un nombre avec des séparateurs de milliers
 */
export function formatCurrency(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Calcule le temps restant jusqu'à la prochaine recharge
 */
export function getTimeUntilNextSpin(lastSpinAt: Date): {
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const nextSpinAt = new Date(lastSpinAt.getTime() + 30 * 60 * 1000); // 30 minutes
  const diff = Math.max(0, nextSpinAt.getTime() - now.getTime());
  
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return { minutes, seconds, totalSeconds };
}

/**
 * Génère un nom d'utilisateur aléatoire
 */
export function generateUsername(): string {
  const adjectives = ['Swift', 'Mighty', 'Brave', 'Epic', 'Royal', 'Golden', 'Shadow', 'Thunder'];
  const nouns = ['King', 'Queen', 'Warrior', 'Builder', 'Raider', 'Champion', 'Legend', 'Master'];
  const randomNumber = Math.floor(Math.random() * 9999);
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}${randomNumber}`;
}

/**
 * Utilitaire pour combiner des classes CSS (compatible avec Tailwind)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
