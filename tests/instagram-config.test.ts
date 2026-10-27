import assert from 'node:assert/strict';
import test from 'node:test';

import {
  loadInstagramConfig,
  validateInstagramConfig,
} from '../src/instagram-config.ts';

test('accepts the two weekday publishing slots', () => {
  const config = loadInstagramConfig();

  assert.deepEqual(validateInstagramConfig(config), { valid: true });
  assert.deepEqual(config.schedule.weekdays, ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  assert.equal(config.schedule.story.time, '09:00');
  assert.equal(config.schedule.feed.time, '15:00');
});

test('rejects a schedule containing a weekend day', () => {
  const config = loadInstagramConfig();
  config.schedule.weekdays = [...config.schedule.weekdays, 'saturday'];

  assert.deepEqual(validateInstagramConfig(config), {
    valid: false,
    errors: ['schedule.weekdays may contain weekdays only'],
  });
});

test('requires automatic captions for Feed posts', () => {
  const config = loadInstagramConfig();
  config.schedule.feed.automaticCaption = false;

  assert.deepEqual(validateInstagramConfig(config), {
    valid: false,
    errors: ['schedule.feed.automaticCaption must be true'],
  });
});

test('keeps free creation as the fallback when no weekly topic is provided', () => {
  const config = loadInstagramConfig();

  assert.equal(config.editorial.missingWeeklyTopic, 'free_creation_from_references');
});

test('rejects email settings in the Instagram configuration', () => {
  const config = { ...loadInstagramConfig(), smtp: { host: 'mail.example.com' } };

  assert.deepEqual(validateInstagramConfig(config), {
    valid: false,
    errors: ['email settings are not supported in this client workspace'],
  });
});
