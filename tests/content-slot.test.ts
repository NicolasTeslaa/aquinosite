import assert from 'node:assert/strict';
import { access, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import { runContentSlot } from '../src/content-slot.ts';
import type { InstagramClient } from '../src/instagram-publisher.ts';

async function scenePath(directory: string, width = 1080, height = 1920): Promise<string> {
  const path = join(directory, 'scene.png');
  await sharp({ create: { width, height, channels: 4, background: '#20C8F3' } }).png().toFile(path);
  return path;
}

test('accepts a Monday Story slot and writes the final asset before publication', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-slot-'));
  const scene = await scenePath(directory, 1080, 1920);
  const client: InstagramClient = {
    async createMediaContainer() { throw new Error('publication unavailable access_token=secret'); },
    async publishMedia() { throw new Error('not reached'); }
  };

  const result = await runContentSlot({
    channel: 'story',
    scheduledAt: new Date('2026-10-26T12:00:00.000Z'),
    imagePath: scene,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    imageUrl: 'https://cdn.test/story.png',
    brief: { slug: 'equipamento-pronto', headline: 'CUIDAR BEM', body: 'Informação ajuda na rotina.', cta: 'Fale com a AquiNoSite' },
    recognizeText: async () => 'CUIDAR BEM Informação ajuda na rotina. Fale com a AquiNoSite AquiNoSite Saúde',
    client
  });

  assert.equal(result.generation.status, 'generated');
  assert.equal(result.publication?.status, 'failed');
  await access(result.assetPath);
});

test('rejects weekend slots without creating or publishing an asset', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-slot-'));
  const scene = await scenePath(directory);

  await assert.rejects(() => runContentSlot({
    channel: 'feed',
    scheduledAt: new Date('2026-10-25T18:00:00.000Z'),
    imagePath: scene,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    imageUrl: 'https://cdn.test/feed.png',
    brief: { slug: 'domingo', headline: 'TESTE', body: 'Teste', cta: 'Fale com a AquiNoSite' },
    publish: false
  }), /weekday/i);
});

test('passes product containment through the content slot', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-slot-product-'));
  const scene = join(directory, 'wide-product.png');
  await sharp({ create: { width: 1080, height: 1080, channels: 4, background: '#FF0000' } }).png().toFile(scene);

  const result = await runContentSlot({
    channel: 'feed',
    scheduledAt: new Date('2026-10-26T18:00:00.000Z'),
    imagePath: scene,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    brief: { slug: 'produto-inteiro', headline: 'PRODUTO EM DESTAQUE', body: 'Veja o equipamento completo.', cta: 'Conheça o equipamento' },
    recognizeText: async () => 'PRODUTO EM DESTAQUE Veja o equipamento completo. Conheça o equipamento AquiNoSite Saúde',
    publish: false
  });

  assert.equal(await access(result.assetPath).then(() => true), true);
});

test('regenerates with OCR feedback when the first ImageGen attempt has a spelling error', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-slot-retry-'));
  const image = await scenePath(directory, 1080, 1080);
  let ocrCalls = 0;
  let generationCalls = 0;

  const result = await runContentSlot({
    channel: 'feed',
    scheduledAt: new Date('2026-10-26T18:00:00.000Z'),
    imagePath: image,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    brief: { slug: 'corrigir-grafia', headline: 'CUIDAR BEM', body: 'Informação ajuda na rotina.', cta: 'Fale com a AquiNoSite' },
    recognizeText: async () => {
      ocrCalls += 1;
      return ocrCalls === 1 ? 'CUIDAR BEN Informação ajuda na rotina. Fale com a AquiNoSite AquiNoSite Saúde' : 'CUIDAR BEM Informação ajuda na rotina. Fale com a AquiNoSite AquiNoSite Saúde';
    },
    generateImage: async ({ errors }) => {
      generationCalls += 1;
      assert.deepEqual(errors, ['OCR copy mismatch: CUIDAR BEM']);
      return image;
    },
    publish: false
  });

  assert.equal(result.generation.status, 'generated');
  assert.equal(generationCalls, 1);
  assert.equal(ocrCalls, 2);
});
