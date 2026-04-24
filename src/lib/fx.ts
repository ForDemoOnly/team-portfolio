/**
 * Small deterministic helpers. Turn a seed (an entry id/slug) into a short,
 * stable hex tag — used as a per-entry identifier in the UI.
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
