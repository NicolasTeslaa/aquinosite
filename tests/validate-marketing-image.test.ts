import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import { validateMarketingImage } from '../src/validate-marketing-image.ts';

test('accepts a correctly sized Story with a composition manifest', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-validate-'));
  const output = join(directory, '2026-10-28_09-00-00_story_v01.png');
  await sharp({ create: { width: 1080, height: 1920, channels: 4, background: '#FFFFFF' } }).png().withMetadata({ density: 72 }).toFile(output);

  const result = await validateMarketingImage({
    imagePath: output,
    format: 'story',
    logoApplied: true,
    copyBounds: { x: 100, y: 300, width: 880, height: 1000 },
    hashRecords: []
  });

  assert.equal(result.valid, true);
});

test('rejects a Story copy that leaves the safe area', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-validate-'));
  const output = join(directory, '2026-10-28_09-00-00_story_v01.png');
  await sharp({ create: { width: 1080, height: 1920, channels: 4, background: '#FFFFFF' } }).png().toFile(output);

  const result = await validateMarketingImage({
    imagePath: output,
    format: 'story',
    logoApplied: true,
    copyBounds: { x: 100, y: 100, width: 880, height: 1000 },
    hashRecords: []
  });

  assert.deepEqual(result, { valid: false, errors: ['copy leaves the configured safe area'] });
});
