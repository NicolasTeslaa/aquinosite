import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { appendMarketingRecord, readMarketingRecords, sanitizeApiError } from '../src/marketing-log.ts';

test('persists and reads marketing records as JSON lines', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aquinosite-log-'));
  const path = join(directory, 'marketing.jsonl');
  await appendMarketingRecord({ assetPath: 'assets/marketing/a.png', hash: 'abc', status: 'generated' }, path);

  assert.deepEqual(await readMarketingRecords(path), [{ assetPath: 'assets/marketing/a.png', hash: 'abc', status: 'generated' }]);
  assert.equal((await readFile(path, 'utf8')).split('\n').length, 2);
});

test('sanitizes API errors without exposing tokens', () => {
  assert.equal(sanitizeApiError(new Error('request failed access_token=secret-token')), 'request failed access_token=[redacted]');
});
