import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { publishInstagram, type ContainerInput, type InstagramClient } from '../src/instagram-publisher.ts';

test('publishes Story without a Feed caption and records the permalink', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-publish-'));
  const calls: ContainerInput[] = [];
  const client: InstagramClient = {
    async createMediaContainer(input) { calls.push(input); return 'container-1'; },
    async publishMedia() { return { id: 'media-1', permalink: 'https://instagram.test/story' }; }
  };

  const result = await publishInstagram({
    assetPath: 'assets/marketing/story.png',
    imageUrl: 'https://cdn.test/story.png',
    hash: 'hash-1',
    format: 'story',
    logPath: join(directory, 'log.jsonl')
  }, client);

  assert.equal(result.status, 'published');
  assert.equal(calls[0].media_type, 'STORIES');
  assert.equal(calls[0].caption, undefined);
  assert.equal(result.permalink, 'https://instagram.test/story');
});

test('records a sanitized failure while leaving the generated asset publishable later', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-publish-'));
  const client: InstagramClient = {
    async createMediaContainer() { throw new Error('Graph failed access_token=secret'); },
    async publishMedia() { throw new Error('not reached'); }
  };

  const result = await publishInstagram({
    assetPath: 'assets/marketing/feed.png',
    imageUrl: 'https://cdn.test/feed.png',
    hash: 'hash-2',
    format: 'feed',
    caption: 'Legenda corrida.',
    logPath: join(directory, 'log.jsonl')
  }, client);

  assert.equal(result.status, 'failed');
  assert.equal(result.error, 'Graph failed access_token=[redacted]');
  assert.equal(result.assetPath, 'assets/marketing/feed.png');
});
