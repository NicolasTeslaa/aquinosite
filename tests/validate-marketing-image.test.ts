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
    expectedCopy: ['CUIDAR BEM'],
    recognizeText: async () => 'CUIDAR BEM',
    hashRecords: []
  });

  assert.equal(result.valid, true);
});

test('rejects an image with dimensions that do not match the generated format', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-validate-'));
  const output = join(directory, '2026-10-28_09-00-00_story_v01.png');
  await sharp({ create: { width: 100, height: 100, channels: 4, background: '#FFFFFF' } }).png().toFile(output);

  const result = await validateMarketingImage({
    imagePath: output,
    format: 'story',
    expectedCopy: [],
    recognizeText: async () => '',
    hashRecords: []
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.valid ? [] : result.errors, ['image must be 1080x1920']);
});

test('rejects generated art when OCR finds a spelling error in the expected copy', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-validate-ocr-'));
  const output = join(directory, '2026-10-28_09-00-00_story_v01.png');
  await sharp({ create: { width: 1080, height: 1920, channels: 4, background: '#FFFFFF' } }).png().toFile(output);

  const result = await validateMarketingImage({
    imagePath: output,
    format: 'story',
    expectedCopy: ['CUIDAR BEM', 'Informação ajuda na rotina.', 'Fale com a AquiNoSite'],
    recognizeText: async () => 'CUIDAR BEN Informação ajuda na rotina. Fale com a AquiNoSite',
    hashRecords: []
  });

  assert.deepEqual(result, { valid: false, errors: ['OCR copy mismatch: CUIDAR BEM'] });
});

test('accepts generated art when OCR confirms every expected copy string', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-validate-ocr-pass-'));
  const output = join(directory, '2026-10-28_09-00-00_story_v01.png');
  await sharp({ create: { width: 1080, height: 1920, channels: 4, background: '#FFFFFF' } }).png().toFile(output);

  const result = await validateMarketingImage({
    imagePath: output,
    format: 'story',
    expectedCopy: ['CUIDAR BEM', 'Informação ajuda na rotina.', 'Fale com a AquiNoSite'],
    recognizeText: async () => 'CUIDAR BEM Informação ajuda na rotina. Fale com a AquiNoSite',
    hashRecords: []
  });

  assert.equal(result.valid, true);
});
