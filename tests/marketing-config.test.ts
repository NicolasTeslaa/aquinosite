import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

import {
  loadMarketingConfig,
  loadReferenceMap,
  validateMarketingConfig,
} from '../src/marketing-config.ts';

test('defines exact AquiNoSite Story and Feed formats with safe areas', async () => {
  const config = loadMarketingConfig();

  assert.deepEqual(config.formats.story.dimensions, { width: 1080, height: 1920 });
  assert.deepEqual(config.formats.feed.dimensions, { width: 1080, height: 1080 });
  assert.ok(config.formats.story.safeArea.top > 0);
  assert.ok(config.formats.story.safeArea.bottom > 0);
  assert.equal(config.brand.logoPath, 'assets/logo/logo.png');
  await access(config.brand.logoPath);
  assert.deepEqual(validateMarketingConfig(config), { valid: true });
});

test('reference map only points to AquiNoSite reference assets', () => {
  const references = loadReferenceMap();
  const paths = Object.values(references).filter(Array.isArray).flat() as string[];

  assert.ok(references.education.length > 0);
  assert.ok(paths.every((path) => path.startsWith('assets/referencias/')));
});

test('all configured visual references are available in the repository', async () => {
  const references = loadReferenceMap();
  const paths = Object.values(references).filter(Array.isArray).flat() as string[];

  for (const path of paths) {
    await access(resolve(path));
  }
});
