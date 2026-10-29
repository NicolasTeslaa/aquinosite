import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import { composeMarketingImage, editorialHeadlineLines } from '../src/compose-marketing-image.ts';

function rgbAt(data: Buffer, width: number, channels: number, x: number, y: number): number[] {
  const pixel = (y * width + x) * channels;
  return Array.from(data.subarray(pixel, pixel + 3));
}

test('uses the editorial Feed layout by default without washing out the scene', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'feed.png');
  await sharp({ create: { width: 400, height: 400, channels: 4, background: '#20C8F3' } }).png().toFile(scene);

  const result = await composeMarketingImage({
    scenePath: scene,
    outputPath: output,
    format: 'feed',
    logoPath: 'assets/logo/logo.png',
    headline: 'CUIDAR BEM',
    body: 'Informação para apoiar sua rotina de saúde.',
    cta: 'Fale com a AquiNoSite'
  });

  const metadata = await sharp(output).metadata();
  assert.deepEqual({ width: metadata.width, height: metadata.height }, { width: 1080, height: 1080 });
  assert.equal(metadata.channels, 3);
  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(rgbAt(data, info.width, info.channels, 100, 80), [7, 27, 58]);
  assert.deepEqual(rgbAt(data, info.width, info.channels, 900, 300), [32, 200, 243]);
  assert.deepEqual(result.copyBounds, { x: 80, y: 80, width: 440, height: 720 });
  let whiteLabelPixels = 0;
  for (let y = 100; y < 144; y += 1) {
    for (let x = 80; x < 370; x += 1) {
      const [red, green, blue] = rgbAt(data, info.width, info.channels, x, y);
      if (red === 255 && green === 255 && blue === 255) whiteLabelPixels += 1;
    }
  }
  assert.ok(whiteLabelPixels > 100, 'brand label must use high-contrast white text');
  let logoColorPixels = 0;
  for (let y = 869; y < 989; y += 1) {
    for (let x = 100; x < 330; x += 1) {
      const [red, green, blue] = rgbAt(data, info.width, info.channels, x, y);
      if (red < 220 || green < 220 || blue < 220) logoColorPixels += 1;
    }
  }
  assert.ok(logoColorPixels > 1000, 'official logo must remain legible at phone scale');
});

test('uses the editorial Story layout by default with an unwashed lower scene', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-story-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'story.png');
  await sharp({ create: { width: 400, height: 400, channels: 4, background: '#20C8F3' } }).png().toFile(scene);

  const result = await composeMarketingImage({
    scenePath: scene,
    outputPath: output,
    format: 'story',
    logoPath: 'assets/logo/logo.png',
    headline: 'ESCOLHA COM INFORMAÇÃO',
    body: 'Um equipamento adequado começa por uma orientação clara.',
    cta: 'Fale com a AquiNoSite'
  });

  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(rgbAt(data, info.width, info.channels, 100, 300), [7, 27, 58]);
  assert.deepEqual(rgbAt(data, info.width, info.channels, 540, 1200), [32, 200, 243]);
  assert.deepEqual(result.copyBounds, { x: 100, y: 250, width: 880, height: 820 });
});

test('reference style keeps a high-contrast navy field instead of washing out the scene', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-reference-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'feed.png');
  await sharp({ create: { width: 400, height: 400, channels: 4, background: '#20C8F3' } }).png().toFile(scene);

  await composeMarketingImage({
    scenePath: scene,
    outputPath: output,
    format: 'feed',
    logoPath: 'assets/logo/logo.png',
    headline: 'CUIDADO QUE COMEÇA ANTES DA ESCOLHA',
    body: 'Informação, atenção e parceria para a rotina da saúde.',
    cta: 'Conheça o AquiNoSite',
    visualStyle: 'reference-high-contrast'
  });

  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  const pixel = (100 * info.width + 100) * info.channels;
  assert.deepEqual(Array.from(data.subarray(pixel, pixel + 3)), [18, 58, 140]);
});

test('AquiNoSite structural style uses a white editorial field and blue base arc', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-white-arc-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'feed.png');
  await sharp({ create: { width: 400, height: 400, channels: 4, background: '#20C8F3' } }).png().toFile(scene);

  await composeMarketingImage({
    scenePath: scene,
    outputPath: output,
    format: 'feed',
    logoPath: 'assets/logo/logo.png',
    headline: 'ANALÓGICO OU DIGITAL',
    body: 'A escolha depende da sua rotina.',
    cta: 'Tire suas dúvidas',
    visualStyle: 'reference-white-arc'
  });

  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(rgbAt(data, info.width, info.channels, 200, 800), [255, 255, 255]);
  let blueArcPixels = 0;
  for (let y = 900; y < 1080; y += 1) {
    for (let x = 0; x < 540; x += 1) {
      const [red, green, blue] = rgbAt(data, info.width, info.channels, x, y);
      if (blue > 180 && red < 80 && green < 150) blueArcPixels += 1;
    }
  }
  assert.ok(blueArcPixels > 1000, 'blue structural arc must cross the lower composition');
});

test('wraps editorial headlines before they invade the subject area', () => {
  assert.deepEqual(editorialHeadlineLines('FORÇA QUE PODE SER MEDIDA', 'feed'), ['FORÇA QUE', 'PODE SER', 'MEDIDA']);
  assert.deepEqual(editorialHeadlineLines('QUAL DINAMÔMETRO COMBINA COM SUA ROTINA?', 'story'), ['QUAL DINAMÔMETRO', 'COMBINA COM SUA', 'ROTINA?']);
});

test('can contain a wide product scene without cropping it', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-compose-contain-'));
  const scene = join(directory, 'scene.png');
  const output = join(directory, 'feed.png');
  await sharp({ create: { width: 800, height: 400, channels: 4, background: '#FF0000' } }).png().toFile(scene);

  await composeMarketingImage({
    scenePath: scene,
    sceneFit: 'contain',
    outputPath: output,
    format: 'feed',
    logoPath: 'assets/logo/logo.png',
    headline: 'PRODUTO EM DESTAQUE',
    body: 'Veja o equipamento completo.',
    cta: 'Conheça o equipamento'
  });

  const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(rgbAt(data, info.width, info.channels, 900, 100), [255, 255, 255]);
  assert.deepEqual(rgbAt(data, info.width, info.channels, 900, 540), [255, 0, 0]);
});
