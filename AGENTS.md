# Preferências do projeto AquiNoSite

## Geração automática de duas artes

Quando o usuário pedir “duas imagens”, “duas artes”, ou “Story e Feed” para o AquiNoSite, não pedir que ele escolha o tipo de conteúdo, salvo se houver uma lacuna que impeça uma criação segura. Analisar primeiro as artes já existentes em `assets/marketing/`, evitar repetir tema, texto, produto, enquadramento e composição recentes, e escolher autonomamente uma pauta criativa dentro das fontes editoriais e dos critérios aceitos pelo cliente.

Gerar sempre uma arte Story 9:16 e uma arte Feed 1:1, com propostas visualmente distintas das peças anteriores. Usar ao menos uma referência visual existente em `assets/referencias/` ou `prompt-kit-aquinosite/assets/referencias/`, registrar a referência e o papel editorial no briefing/registro da geração, usar somente a logo oficial configurada em `config/identidade-visual.json`, salvar em `assets/marketing/`, inspecionar as imagens finais e executar a validação de marketing antes de disponibilizar as artes.

Sempre que gerar uma arte de Feed, gerar e salvar também uma legenda em português brasileiro no mesmo pacote, em um arquivo `*_legenda-feed.md` correspondente. A legenda deve explicar o tema da arte sem inventar especificações, resultados, preços, prazos ou promessas médicas e terminar com uma chamada para ação coerente com as fontes do cliente. Validar a legenda junto com a arte antes de disponibilizar o Feed.

Ao concluir uma alteração de código ou documentação de regra no repositório, verificar `.github/workflows/`. Se não houver workflow do GitHub Actions, revisar o diff, fazer commit somente do escopo desta tarefa e executar push para a branch/remoto configurados. Preservar alterações pré-existentes não relacionadas.
