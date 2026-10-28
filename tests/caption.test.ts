import assert from 'node:assert/strict';
import test from 'node:test';

import { buildFeedCaption } from '../src/caption.ts';

test('builds a continuous Brazilian-Portuguese caption without literal newline escapes', () => {
  const caption = buildFeedCaption({
    problem: 'A rotina de atendimento precisa de informações claras.',
    benefit: 'Conteúdo confiável ajuda profissionais a conhecerem melhor os equipamentos.',
    cta: 'Fale com a AquiNoSite.',
    keywords: ['equipamentos de saúde', 'assistência técnica']
  });

  assert.ok(caption.includes('equipamentos de saúde'));
  assert.ok(caption.endsWith('Fale com a AquiNoSite.'));
  assert.equal(caption.includes('\\n'), false);
});
