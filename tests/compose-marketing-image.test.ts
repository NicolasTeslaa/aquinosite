import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import { composeMarketingImage } from '../src/compose-marketing-image.ts';

test('composes an exact-size Feed image with official logo and copy', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'feed.png');
  await sharp({ create: { width: 400, height: 400, channels: 4, background: '#20C8F3' } }).png().toFile(scene);

  await composeMarketingImage({
    scenePath: scene,
    outputPath: output,
    format: 'feed',
    logoPath: 'assets/logo/aquinosite-logo-cliente-01.jpeg',
    headline: 'CUIDAR BEM',
    body: 'Informação para apoiar sua rotina de saúde.',
    cta: 'Fale com a AquiNoSite'
  });

  const metadata = await sharp(output).metadata();
  assert.deepEqual({ width: metadata.width, height: metadata.height }, { width: 1080, height: 1080 });
  assert.equal(metadata.channels, 3);
  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  const pixel = (950 * info.width + 90) * info.channels;
  assert.ok(data[pixel] > 10 && data[pixel + 1] > 10 && data[pixel + 2] > 10);
});
