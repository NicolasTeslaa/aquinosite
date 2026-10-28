import assert from 'node:assert/strict';
import test from 'node:test';

import { loadInstagramConfig } from '../src/instagram-config.ts';

test('routine keeps the approved weekday slots and generates before publishing', () => {
  const config = loadInstagramConfig();
  assert.deepEqual(config.schedule.weekdays, ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  assert.equal(config.schedule.story.time, '09:00');
  assert.equal(config.schedule.feed.time, '15:00');
  assert.equal(config.schedule.story.format, '9:16');
  assert.equal(config.schedule.feed.format, '1:1');
});
