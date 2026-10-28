import assert from 'node:assert/strict';
import { access, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import { runContentSlot } from '../src/content-slot.ts';
import type { InstagramClient } from '../src/instagram-publisher.ts';

async function scenePath(directory: string): Promise<string> {
  const path = join(directory, 'scene.png');
  await sharp({ create: { width: 300, height: 300, channels: 4, background: '#20C8F3' } }).png().toFile(path);
  return path;
}

test('accepts a Monday Story slot and writes the final asset before publication', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-slot-'));
  const scene = await scenePath(directory);
  const client: InstagramClient = {
    async createMediaContainer() { throw new Error('publication unavailable access_token=secret'); },
    async publishMedia() { throw new Error('not reached'); }
  };

  const result = await runContentSlot({
    channel: 'story',
    scheduledAt: new Date('2026-10-26T12:00:00.000Z'),
    scenePath: scene,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    imageUrl: 'https://cdn.test/story.png',
    brief: { slug: 'equipamento-pronto', headline: 'CUIDAR BEM', body: 'Informação ajuda na rotina.', cta: 'Fale com a AquiNoSite' },
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
    scenePath: scene,
    outputDir: directory,
    logPath: join(directory, 'log.jsonl'),
    imageUrl: 'https://cdn.test/feed.png',
    brief: { slug: 'domingo', headline: 'TESTE', body: 'Teste', cta: 'Fale com a AquiNoSite' },
    publish: false
  }), /weekday/i);
});
