# AquiNoSite — base editorial e publicação no Instagram

**Data:** 2026-10-26  
**Status:** aprovado para especificação; aguardando revisão do documento antes da implementação

## Objetivo

Preparar este repositório para operar a rotina de conteúdo do cliente AquiNoSite, isolando identidade, referências, configuração de publicação e materiais de criação. A rotina deve suportar duas imagens por dia útil — um Story às 09:00 e uma publicação no Feed às 15:00 — com legenda automática no Feed e publicação automática sem aprovação individual.

As 10 imagens de referência aprovadas pelo cliente serão produzidas em uma etapa posterior. Esta tarefa prepara a estrutura, as regras e os arquivos de configuração necessários, mas não gera essas imagens.

## Regras editoriais confirmadas

- Cliente: AquiNoSite.
- Instagram: `@aquinosite.saude`.
- Site de referência: `https://www.aquinosite.com.br/`.
- O cliente pode enviar a pauta semanalmente às segundas-feiras.
- Se não houver pauta, a criação é livre, baseada no site, no Instagram e nas referências visuais registradas no repositório.
- Não há restrições específicas de conteúdo informadas pelo cliente.
- Frequência: de segunda a sexta-feira, dois conteúdos por dia.
- Distribuição diária: um Story e um Feed.
- Story: formato vertical 9:16, horário padrão 09:00.
- Feed: formato 1:1 por padrão, horário padrão 15:00, sempre com legenda automática.
- As publicações não aguardam aprovação individual.
- Os horários podem ser ajustados posteriormente conforme dados de visualização.

## Estrutura proposta

```text
.
├── .agents/skills/aquinosite/
│   └── SKILL.md
├── assets/
│   ├── logo/
│   ├── referencias/
│   └── marketing/
├── config/
│   └── instagram.json
├── docs/
│   ├── empresa.md
│   └── superpowers/specs/
├── tests/
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

### Identidade e conteúdo

- `assets/logo/` armazenará somente logos fornecidos pelo cliente.
- `assets/referencias/` armazenará a imagem de identidade visual e referências de composição aprovadas.
- `assets/marketing/` armazenará artes finais, com nomes no formato `YYYY-MM-DD_HH-mm-ss_descricao-curta_vNN.ext`, usando o fuso `America/Sao_Paulo`.
- `docs/empresa.md` registrará apenas informações verificadas ou fornecidas pelo cliente, distinguindo escopo conhecido de hipóteses.
- `SKILL.md` estabelecerá regras para criação de artes originais, uso de logo, área segura do Story e legendas em português brasileiro.

### Configuração de publicação

`config/instagram.json` será a fonte versionada das regras não secretas:

- identificador e perfil do cliente;
- dias úteis habilitados;
- horários de Story e Feed;
- formatos esperados;
- legenda automática do Feed;
- publicação automática sem aprovação;
- fallback editorial quando a pauta semanal estiver ausente;
- URLs de referência editorial.

Credenciais e tokens ficarão apenas no `.env`, com `.env.example` contendo nomes de variáveis e valores vazios ou ilustrativos. Nenhuma credencial da Teslinha será copiada. A configuração deverá prever as variáveis necessárias para autenticação Meta/Instagram e para disponibilizar a mídia em URL pública, sem adicionar variáveis SMTP.

## Separação de escopo

Serão excluídos deliberadamente:

- `email-automacao-instagram.html`;
- gerador de e-mails, planilhas de contatos e perfis de prospecção;
- variáveis SMTP;
- documentos, logos, artes e textos específicos da Teslinha;
- projetos de motion e áudios específicos da Teslinha, pois a entrega atual é uma base de imagens e publicação.

O modelo estrutural da Teslinha será usado apenas como referência de organização e convenções editoriais.

## Validação e testes

Antes da implementação de cada comportamento, serão escritos testes de comportamento para:

1. aceitar a configuração exata de dois slots por dia útil, com Story às 09:00 e Feed às 15:00;
2. rejeitar uma configuração que inclua domingo ou sábado como dia de publicação;
3. exigir legenda automática para o slot de Feed;
4. preservar o fallback de criação livre quando a pauta semanal estiver ausente;
5. impedir referências a SMTP ou configurações de e-mail na configuração final.

Os testes devem falhar primeiro, depois passar com a implementação mínima e permanecer verdes após a refatoração. A validação final também deve conferir que o `.env` não está rastreado pelo Git e que nenhum segredo foi copiado.

## Critérios de aceite

- O repositório contém a estrutura de pastas definida acima.
- A documentação identifica o cliente como AquiNoSite e não contém dados institucionais da Teslinha.
- A configuração expressa a rotina de 2 conteúdos por dia útil, nos formatos e horários definidos.
- O comportamento sem pauta semanal está documentado como criação livre baseada nas referências disponíveis.
- Não existem arquivos ou variáveis de e-mail na base criada.
- Segredos permanecem fora do Git e existe um `.env.example` utilizável.
- Os testes de configuração passam e a execução final informa os comandos e resultados reais.

## Dependências operacionais posteriores

A publicação automática real exige credenciais válidas da conta profissional no ecossistema Meta/Instagram, permissões adequadas e uma URL pública acessível para cada mídia. Esses dados não serão inventados nem incluídos nesta etapa; o repositório ficará preparado para recebê-los localmente.
