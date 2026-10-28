import assert from 'node:assert/strict';
import test from 'node:test';

import { validateEditorialBrief, validateProductReference } from '../src/editorial-contract.ts';

test('accepts a catalog product with an official page path', () => {
  const result = validateProductReference('dinamometro-analogico-hidraulico-de-mao-sh5001');

  assert.equal(result.valid, true);
});

test('rejects an unknown product', () => {
  const result = validateProductReference('equipamento-inventado');

  assert.deepEqual(result, { valid: false, errors: ['product is not present in the official catalog'] });
});

test('rejects unsupported health claims while allowing educational content', () => {
  const result = validateEditorialBrief({
    theme: 'education',
    text: 'Este produto garante a cura de qualquer problema.'
  });

  assert.deepEqual(result, { valid: false, errors: ['brief contains an unsupported medical or guaranteed-result claim'] });
});

test('accepts an institutional brief without a product', () => {
  assert.deepEqual(validateEditorialBrief({ theme: 'institutional', text: 'Informação para apoiar sua rotina de saúde.' }), { valid: true });
});
