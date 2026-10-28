# AquiNoSite — conteúdo para Instagram

Base isolada para criação e publicação automática de conteúdo do AquiNoSite no Instagram.

## Rotina aprovada

- Segunda a sexta-feira: um Story às 09:00 e um Feed às 15:00.
- Story em formato vertical `9:16`.
- Feed em formato `1:1` por padrão.
- Publicações do Feed recebem legenda automática.
- As mídias são publicadas automaticamente, sem aprovação individual.
- O cliente pode enviar a pauta semanal às segundas-feiras. Sem pauta, a criação é livre e deve usar o site, o Instagram e as referências visuais do cliente como base.

As regras versionadas ficam em [`config/instagram.json`](config/instagram.json). A rotina ainda depende de credenciais Meta/Instagram e de uma URL pública para cada mídia antes de publicar em produção.

## Estrutura

```text
.agents/skills/      Regras operacionais do projeto
assets/logo/         Logos fornecidos pelo cliente
assets/referencias/  Identidade visual e referências aprovadas
assets/marketing/    Artes finais de Feed e Story
config/              Agenda, identidade visual, prompts e fontes editoriais
docs/                Perfil institucional, decisões e rotina
logs/marketing/      Registros locais de geração e publicação
scripts/             Composição, validação e publicação
src/                 Pipeline tipado de marketing
tests/               Testes de comportamento
```

As 10 imagens iniciais para avaliação de estilo serão criadas posteriormente; esta base não contém artes geradas nesta etapa.

Produtos mostrados em artes devem existir no catálogo oficial de [`config/catalogo-produtos.json`](config/catalogo-produtos.json). A página individual do produto no site é a referência visual obrigatória; não são permitidos produtos imaginários, genéricos ou de fontes externas.

### Logo — critério de aceite obrigatório

Toda imagem com a marca deve usar a logo oficial de `assets/logo/`. Nunca aceitar uma logo redesenhada ou gerada por IA. A composição deve ser gerada com espaço reservado e a logo oficial deve ser aplicada na etapa final; depois, conferir símbolo, proporções, grafia, acentuação, cores e espaçamentos antes de salvar ou publicar.

## Configuração local

```bash
cp .env.example .env
npm install
npm test
npm run typecheck
```

Preencha o `.env` somente com credenciais e endpoints reais autorizados. Nunca versione esse arquivo.

## Pipeline de marketing

O pipeline cria a composição visual sem logo e texto promocional, aplica os elementos oficiais por código, normaliza o arquivo para o formato do canal, valida a área segura e só depois tenta publicar. A imagem final é preservada quando a API do Instagram falha.

Exemplos de execução local:

```bash
npm test
npm run typecheck
npm run marketing:slot -- --dry-run --channel=story --scheduled-at=2026-10-26T12:00:00.000Z --scene=/caminho/cena.png --slug=educacao-equipamento --headline="CUIDAR BEM" --body="Informação ajuda na rotina." --cta="Fale com a AquiNoSite"
npm run marketing:validate -- --image=assets/marketing/arquivo.png --format=story
npm run marketing:publish -- --asset=assets/marketing/arquivo.png --image-url=https://url-publica/arquivo.png --format=story
```

As execuções reais devem usar o `.env` local e uma URL pública autorizada para a mídia. Os arquivos em `logs/marketing/*.jsonl` são locais e não devem ser versionados.

## Convenções de criação

Leia [`docs/empresa.md`](docs/empresa.md) e [`.agents/skills/aquinosite/SKILL.md`](.agents/skills/aquinosite/SKILL.md) antes de criar uma peça. Os arquivos finais devem ficar em `assets/marketing/` e seguir o formato de nome `YYYY-MM-DD_HH-mm-ss_descricao-curta_vNN.ext`, no fuso `America/Sao_Paulo`.

## Escopo excluído

Este repositório não usa e-mail, SMTP, listas de contatos ou materiais da Teslinha Suporte.
