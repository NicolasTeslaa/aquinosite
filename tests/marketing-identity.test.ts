import assert from 'node:assert/strict';
import test from 'node:test';

import { assertUniqueHash, formatMarketingFilename, sha256File } from '../src/marketing-identity.ts';

test('formats Sao Paulo marketing filenames with a versioned slug', () => {
  const filename = formatMarketingFilename(new Date('2026-10-28T14:05:06.000Z'), 'produto real', 2, 'png');

  assert.equal(filename, '2026-10-28_11-05-06_produto-real_v02.png');
});

test('rejects a hash already present in publication records', () => {
  assert.throws(() => assertUniqueHash('abc', [{ hash: 'abc' }]), /duplicate/i);
});

test('calculates a stable SHA-256 hash for a file', async () => {
  assert.equal(await sha256File(new URL('./fixtures/hash.txt', import.meta.url)), 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2');
});
