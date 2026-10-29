# Rotina de conteúdo do AquiNoSite

## Agenda

A rotina roda de segunda a sexta no fuso `America/Sao_Paulo`:

- 09:00: gerar, validar e tentar publicar um Story vertical `9:16`.
- 15:00: gerar, validar, criar legenda e tentar publicar um Feed quadrado `1:1`.

Não há aprovação individual. A arte é salva antes da publicação e continua disponível quando a API do Instagram falhar.

## Fluxo de cada slot

1. Ler `docs/empresa.md`, `config/instagram.json`, `config/identidade-visual.json` e o mapa de referências.
2. Selecionar o tema editorial e a referência adequada.
3. Gerar a arte final completa no ImageGen, incluindo logo, textos e CTA.
4. Validar dimensões, nome, hash, produto, legenda e grafia por OCR; se houver erro, gerar novamente no ImageGen.
6. Salvar a arte em `assets/marketing/`.
7. Tentar publicar somente no Instagram.
8. Registrar sucesso ou erro em `logs/marketing/records.jsonl`.

## Falhas

Falha de publicação não apaga a arte e não dispara uma nova geração duplicada. O registro mantém o caminho, hash, canal e erro sanitizado para uma tentativa posterior.

Falha de validação bloqueia a publicação. Produto sem entrada no catálogo oficial deve ser substituído por pauta educacional ou institucional sem produto.
