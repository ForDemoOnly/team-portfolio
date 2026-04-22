/**
 * Deterministic cosmetic helpers — turn IDs/slugs into stable fake telemetry
 * for the 8-bit/network decor. No real data, just consistent per-item.
 */

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function hexId(seed: string, len = 4): string {
  return hash(seed).toString(16).toUpperCase().padStart(8, '0').slice(-len);
}

/** Deterministic byte count, 128KB..8MB-ish range */
export function fakeBytes(seed: string): string {
  const h = hash(seed);
  const kb = 80 + (h % 8000);
  if (kb < 1024) return `${kb} KB`;
  const mb = (kb / 1024).toFixed(1);
  return `${mb} MB`;
}

/** Deterministic latency, 4-80ms */
export function fakePing(seed: string): string {
  const h = hash(seed + 'p');
  const ms = 4 + (h % 77);
  return `${ms}ms`;
}

/** Binary rain column — static random-looking 0/1 string */
export function binColumn(seed: string, rows = 14): string {
  let h = hash(seed);
  const out: string[] = [];
  for (let i = 0; i < rows; i++) {
    const bits: string[] = [];
    for (let j = 0; j < 8; j++) {
      h = (h * 1103515245 + 12345) >>> 0;
      bits.push(h & 1 ? '1' : '0');
    }
    out.push(bits.join(''));
  }
  return out.join('\n');
}

/** TCP flag cycle for decoration */
export function tcpFlag(i: number): 'SYN' | 'ACK' | 'PSH' | 'FIN' {
  return (['SYN', 'ACK', 'PSH', 'FIN'] as const)[i % 4];
}

/** Short HP-bar string: 10 cells, N filled */
export function barCells(fillPct: number): { filled: string; empty: string } {
  const f = Math.max(0, Math.min(10, Math.round(fillPct / 10)));
  return { filled: '█'.repeat(f), empty: '░'.repeat(10 - f) };
}
