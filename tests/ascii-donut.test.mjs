import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('layout renders a background ascii donut behind translucent surfaces', async () => {
  const page = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

  assert.doesNotMatch(page, /data-ascii-donut/);
  assert.match(layout, /data-ascii-donut/);
  assert.match(layout, /ascii-page-bg/);
  assert.match(layout, /prefers-reduced-motion/);
  assert.match(css, /\.ascii-page-bg/);
  assert.match(css, /asciiDonutGlow/);
  assert.match(css, /background: var\(--bg-elev\)/);
  assert.match(css, /background: var\(--bg\)/);
  assert.match(css, /background: var\(--bg-elev-2\)/);
  assert.match(layout, /data-quiet-decor/);
  assert.match(css, /\.quiet-data-rail/);
  assert.match(css, /\.packet-trail/);
  assert.match(css, /\.quiet-hud-label/);
});

test('ascii donut animation is time-based and refreshes on tab visibility changes', async () => {
  const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

  assert.match(layout, /performance\.now\(\)/);
  assert.match(layout, /document\.addEventListener\('visibilitychange'/);
  assert.match(layout, /document\.visibilityState === 'visible'/);
  assert.doesNotMatch(layout, /setTimeout\(\(\) => requestAnimationFrame\(tick\), 42\)/);
});

test('ascii donut remounts after Astro page transitions', async () => {
  const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');

  assert.match(layout, /function mountAsciiDonutBackground\(\)/);
  assert.match(layout, /document\.addEventListener\('astro:page-load'/);
  assert.match(layout, /existing\?\.donut\?\.isConnected/);
  assert.match(layout, /existing\?\.destroy/);
  assert.match(layout, /window\.__asciiDonutBackground/);
  assert.match(layout, /window\.__asciiDonutBackgroundListenerStarted/);
});
