---
name: aquinosite
description: Convenções para identidade, criação de imagens e publicação do AquiNoSite no Instagram.
---

# AquiNoSite

## Fontes e escopo

- Leia `docs/empresa.md` antes de tomar decisões de conteúdo.
- Use `assets/referencias/` como referência visual, nunca como conteúdo a copiar.
- Use somente logos fornecidos pelo cliente em `assets/logo/`.
- A logo é um critério de aceite obrigatório: toda arte que exibir a marca deve usar a logo oficial fornecida pelo cliente, sem redesenho, recriação, estilização, substituição ou variação gerada por IA.
- Não peça ao gerador de imagens para desenhar a logo. Gere a composição com uma área reservada e aplique a logo oficial posteriormente, usando o arquivo de `assets/logo/` como sobreposição.
- O site e o Instagram registrados em `config/instagram.json` são fontes editoriais.
- Não crie alegações médicas, resultados, preços, prazos, certificações ou serviços que não estejam confirmados nas fontes do cliente.

## Regra obrigatória de produtos

- Toda arte que mostrar um produto deve usar um produto real identificado no catálogo oficial em `config/catalogo-produtos.json` e confirmado na página correspondente do site.
- Antes de gerar a imagem, registre a URL da página do produto e use as fotos dessa página como referência do produto real.
- Nunca use banco de imagens, produto de outro site, produto “parecido”, mockup genérico ou equipamento inventado.
- Se não houver página do produto no site, não gere a arte do produto; use uma composição sem produto ou aguarde confirmação do cliente.
- Não altere marca, modelo, formato, botões, conexões ou acessórios do produto de referência.
- A disponibilidade pode mudar: confirme a página no site no momento da criação e não trate o sitemap como prova de estoque.

## Artes

- Salve artes finais em `assets/marketing/`.
- Use `YYYY-MM-DD_HH-mm-ss_descricao-curta_vNN.ext` no fuso `America/Sao_Paulo`.
- Comece variações em `v01` e não sobrescreva uma arte existente.
- Feed: 1:1 por padrão.
- Story: 9:16, preferencialmente 1080×1920, com texto e logo na área central segura.
- Crie uma composição própria; referências servem para linguagem visual, layout e ritmo, enquanto a página oficial fornece o produto exato.
- Inspecione a imagem final antes de disponibilizá-la para publicação.
- Critério de aceite da logo: compare a logo final com o arquivo oficial do cliente e confirme símbolo, proporções, grafia "AquiNoSite", acentuação de "Saúde", cores e espaçamentos. Qualquer diferença reprova a arte e exige correção antes de salvar ou publicar.
- Se o gerador inserir uma logo parecida, texto ilegível ou símbolo diferente, remova essa versão e substitua pela logo oficial; nunca trate uma aproximação como aceitável.

## Legendas

Toda publicação de Feed deve receber legenda automática em português brasileiro. A legenda deve explicar o tema da arte com clareza, evitar promessas não verificadas e terminar com uma chamada para ação coerente com as fontes do cliente. Stories podem usar o texto da própria arte quando isso for suficiente.

## Mix editorial

O perfil não é apenas um catálogo. Distribua as pautas aproximadamente entre educação (30%), contexto profissional (25%), confiança e bastidores (20%), produtos contextualizados (15%) e institucional (10%). Para cada produto divulgado, priorize também uma peça que responda a uma dúvida ou situação de uso relacionada a ele.

## Programação

A rotina não depende de aprovação individual: um Story é programado às 09:00 e um Feed às 15:00, de segunda a sexta-feira. Quando não houver pauta enviada na segunda-feira, use criação livre baseada nas referências aprovadas.
