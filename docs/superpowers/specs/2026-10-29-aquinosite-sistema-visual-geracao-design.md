# Sistema visual e geração de imagens — AquiNoSite Saúde

## Objetivo

Alinhar o sistema visual e o fluxo de geração de imagens do repositório
`aquinosite` ao padrão operacional comprovado no repositório
`teslinhasuporte-identidadevisual`, sem importar a identidade, o conteúdo ou
os fluxos de prospecção e motion da Teslinha.

## Escopo

### Incluído

- Convenções locais para logo, referências, artes finais e documentação.
- Prompt mestre e pacote visual capazes de orientar a IA quando as referências
  forem enviadas como anexos.
- Uso explícito das imagens anexadas como referências de produto, linguagem
  visual ou alvo de edição.
- Geração da cena sem copy final ou logo gerada por IA.
- Aplicação determinística da logo oficial, textos e CTA pelo compositor.
- Validação de formato, área segura, logo aplicada, nome/versionamento e
  duplicidade das artes.
- Testes comportamentais para proteger essas regras.

### Fora do escopo

- Motion, Remotion, vídeos, narração e áudio.
- E-mail, prospecção, contatos e templates comerciais.
- Alteração do fluxo de publicação no Instagram.
- Cópia de logos, textos, paleta ou materiais da Teslinha.

## Regras de negócio e aceite

1. Uma referência anexada deve declarar seu papel: produto real, linguagem
   visual, institucional, assistência ou alvo de edição.
2. Uma arte de produto só pode usar produto identificado no catálogo e em uma
   página oficial confirmada; produto genérico ou parecido é rejeitado.
3. A cena gerada não deve conter a logo do AquiNoSite, nome da empresa ou
   texto editorial importante; esses elementos entram na composição posterior.
4. A logo aplicada deve vir de `assets/logo/` e não pode ser redesenhada,
   substituída ou recriada pelo gerador.
5. Story deve ser `1080x1920` e Feed deve ser `1080x1080`, com copy dentro da
   área segura configurada.
6. A arte final deve ser salva em `assets/marketing/` usando o padrão
   `YYYY-MM-DD_HH-mm-ss_descricao-curta_vNN.png`, sem sobrescrever versões
   anteriores.
7. Uma falha de publicação não deve gerar uma nova arte nem apagar a arte
   validada.
8. Se o gerador não conseguir visualizar uma referência necessária, o fluxo
   deve declarar a limitação; não deve apresentar uma aproximação como fiel.

## Desenho

O projeto manterá o compositor e o validador TypeScript existentes, mas as
instruções de projeto serão reorganizadas para refletir o fluxo de referência
do repositório Teslinha. `prompt.md` será a autoridade textual e
`prompt-completo.html` será o pacote visual autocontido. A skill local do
AquiNoSite descreverá como selecionar e nomear as referências, como distinguir
produto de referência de logo oficial e como executar a revisão visual.

O compositor continuará responsável por aplicar a identidade do AquiNoSite,
incluindo a logo oficial e a copy. A lógica de publicação permanecerá intacta;
somente o contrato de geração/validação será fortalecido quando necessário.

## Verificação

- Testes unitários e comportamentais do compositor, validador e runner.
- Typecheck do projeto.
- Inspeção visual das imagens de referência e de uma arte composta de cada
  formato quando houver entradas disponíveis.
- Revisão final de `git diff` para garantir que somente arquivos do escopo
  sejam incluídos.
