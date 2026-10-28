import assert from 'node:assert/strict';
import test from 'node:test';

import {
  loadMarketingConfig,
  loadReferenceMap,
  validateMarketingConfig,
} from '../src/marketing-config.ts';

test('defines exact AquiNoSite Story and Feed formats with safe areas', () => {
  const config = loadMarketingConfig();

  assert.deepEqual(config.formats.story.dimensions, { width: 1080, height: 1920 });
  assert.deepEqual(config.formats.feed.dimensions, { width: 1080, height: 1080 });
  assert.ok(config.formats.story.safeArea.top > 0);
  assert.ok(config.formats.story.safeArea.bottom > 0);
  assert.equal(config.brand.logoPath, 'assets/logo/aquinosite-logo-cliente-01.jpeg');
  assert.deepEqual(validateMarketingConfig(config), { valid: true });
});

test('reference map only points to AquiNoSite reference assets', () => {
  const references = loadReferenceMap();

  assert.ok(references.education.length > 0);
  assert.ok(references.education.every((path) => path.startsWith('assets/referencias/')));
});
