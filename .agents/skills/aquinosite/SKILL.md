---
name: aquinosite
description: Convenções para identidade, criação de imagens e publicação do AquiNoSite no Instagram.
---

# AquiNoSite

## Fontes e escopo

- Leia `docs/empresa.md` antes de tomar decisões de conteúdo.
- Use `assets/referencias/` como referência visual, nunca como conteúdo a copiar.
- Use somente logos fornecidos pelo cliente em `assets/logo/`.
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

## Legendas

Toda publicação de Feed deve receber legenda automática em português brasileiro. A legenda deve explicar o tema da arte com clareza, evitar promessas não verificadas e terminar com uma chamada para ação coerente com as fontes do cliente. Stories podem usar o texto da própria arte quando isso for suficiente.

## Programação

A rotina não depende de aprovação individual: um Story é programado às 09:00 e um Feed às 15:00, de segunda a sexta-feira. Quando não houver pauta enviada na segunda-feira, use criação livre baseada nas referências aprovadas.
