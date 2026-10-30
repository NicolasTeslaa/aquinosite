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
  assert.ok(caption.includes('Fale com a AquiNoSite.'));
  assert.ok(caption.endsWith('contato@aquinosite.com.br.'));
  assert.equal(caption.includes('\\n'), false);
});

test('always appends the saved AquiNoSite contact block to Feed captions', () => {
  const caption = buildFeedCaption({
    problem: 'A avaliação da força da mão pede um instrumento adequado.',
    benefit: 'O SH5001 apoia uma rotina de avaliação com leitura analógica.',
    cta: 'Entre em contato conosco!',
    keywords: ['dinamômetro analógico', 'equipamentos de saúde']
  });

  assert.match(caption, /Telefone: 11981757722/);
  assert.match(caption, /Instagram: @aquinosite\.saude/);
  assert.match(caption, /www\.aquinosite\.com\.br/);
  assert.match(caption, /contato@aquinosite\.com\.br/);
});
