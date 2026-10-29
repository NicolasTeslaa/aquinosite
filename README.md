# AquiNoSite Saúde

## Sobre a empresa

A AquiNoSite Saúde atua com comércio e serviços relacionados a equipamentos para saúde. A empresa atende profissionais e responsáveis por clínicas, consultórios e operações de saúde que precisam escolher, comparar, utilizar, manter ou substituir equipamentos.

Além de apresentar produtos, a comunicação da marca busca oferecer orientação para que cada pessoa encontre uma solução adequada à sua rotina profissional e à aplicação desejada.

## Presença oficial

- Site: [www.aquinosite.com.br](https://www.aquinosite.com.br/)
- Instagram: [@aquinosite.saude](https://www.instagram.com/aquinosite.saude/)

O site e o Instagram são as principais fontes públicas de informação sobre a empresa, seus produtos, categorias e temas editoriais.

## O que a AquiNoSite oferece

As categorias observadas no site incluem:

- Equipamentos;
- Acessórios;
- Insumos;
- Inaladores;
- Ortopedia;
- Equipamentos analíticos;
- Produtos seminovos;
- Locação;
- Assistência técnica;
- Produtos e equipamentos para uso veterinário.

A disponibilidade, o preço e a condição de cada item podem mudar. Essas informações devem ser confirmadas diretamente na página oficial do produto antes de uma decisão de compra ou publicação específica.

## Produtos e temas identificados

Entre os produtos e assuntos encontrados nas fontes atuais estão:

- Espirômetros Vitalograph, incluindo Pneumotrac, Micro, Alpha Device Studio e In2itive;
- Espirômetro Oscilômetro Tremoflo C 100;
- In-Check Dial G16 Clement Clarke;
- Termômetro Digital Clínico Axilar LCD TH1027 G-Tech;
- Aparelho de Pressão Digital de Pulso P.A. MED;
- Seringa de Calibração de 3 Litros AquiNoSite;
- Eletroencefalógrafos EEG de 16 e 24 canais;
- Dinamômetro Analógico Hidráulico de Mão SH5001;
- Dinamômetro Digital de Mão DHD-1 SH1001;
- Acessórios de espirometria;
- Itens relacionados à fisioterapia respiratória.

Quando um produto é apresentado, a referência deve ser o item real e a página correspondente no site oficial. Não devem ser usados produtos genéricos, equipamentos inventados ou imagens que representem outro modelo.

## Posicionamento

A AquiNoSite não deve ser percebida apenas como um catálogo. A marca combina produto, informação e relacionamento profissional para ajudar o público a tomar decisões mais conscientes.

O conteúdo deve aproximar tecnologia e rotina de saúde com clareza, precisão e confiança, sem inventar resultados, depoimentos, certificações, preços, prazos, garantias ou disponibilidade.

## Conteúdo e comunicação

Os temas prioritários são:

- **Educação:** dúvidas, diferenças entre modelos, manutenção, aplicações e critérios de escolha;
- **Contexto profissional:** equipamentos em clínicas, consultórios, fisioterapia e ambientes de assistência;
- **Confiança:** bastidores, preparação, testes, suporte e relacionamento;
- **Produtos contextualizados:** produtos reais apresentados em situações de uso;
- **Institucional:** categorias, história, parcerias e diferenciais confirmados.

O perfil deve vender conhecimento e confiança, e não somente mostrar produtos. Para cada produto divulgado, é recomendável também produzir conteúdos que respondam a uma dúvida, um problema ou uma situação de uso relacionada a ele.

A linguagem deve ser objetiva e acessível, transformando assuntos técnicos em informações compreensíveis em poucos segundos. Pessoas e profissionais podem aparecer em situações plausíveis, mas o conteúdo não deve sugerir clientes reais, depoimentos ou resultados clínicos não confirmados.

## Identidade visual

A comunicação visual da AquiNoSite Saúde utiliza:

- Azul, azul-marinho, ciano, branco e tons claros de apoio;
- Títulos fortes e de leitura rápida;
- Fotografia de produtos reais e situações profissionais plausíveis;
- Composições limpas, com contraste e hierarquia clara;
- Curvas e elementos azuis que conectam a informação à cena do produto;
- Logo oficial da AquiNoSite Saúde aplicada sem redesenho, alteração ou substituição.

As referências visuais podem orientar composição, ritmo e linguagem, mas não devem ser copiadas. A marca deve manter sua própria logo, suas cores e a representação correta dos produtos.

## Fluxo de geração de imagens

O pacote de geração segue o mesmo padrão operacional usado no projeto de
identidade visual da Teslinha, adaptado ao conteúdo da AquiNoSite Saúde:

1. Leia [`prompt.md`](prompt.md) como autoridade textual e abra
   [`prompt-completo.html`](prompt-completo.html) como complemento visual.
2. Envie a logo oficial de [`assets/logo/logo.png`](assets/logo/logo.png) e as
   referências pertinentes de [`assets/referencias/`](assets/referencias/).
3. Registre no briefing o caminho e o papel de cada referência: produto,
   educação, assistência ou institucional.
4. Gere a arte final completa no ImageGen, incluindo logo, texto e CTA. Não
   use compositor, overlay, recorte, redimensionamento ou qualquer edição
   posterior para alterar a arte.
5. Execute [`src/validate-marketing-image.ts`](src/validate-marketing-image.ts)
   com OCR antes de publicar. Se a grafia divergir do briefing, gere uma nova
   arte no ImageGen com a correção; nunca corrija o arquivo por edição externa.

Se uma referência necessária não estiver disponível ou não puder ser
visualizada pelo gerador, o fluxo deve declarar a limitação e não substituir o
produto por uma aproximação genérica. O catálogo e a página oficial continuam
sendo obrigatórios para qualquer peça que mostre um produto específico.

## Instagram

A rotina editorial aprovada contempla duas peças por dia útil:

| Canal | Horário padrão | Formato |
| --- | ---: | --- |
| Story | 09:00 | Vertical, proporção 9:16 |
| Feed | 15:00 | Quadrado, proporção 1:1 |

As publicações são planejadas para segunda a sexta-feira, no fuso de Brasília. O assunto da semana pode ser enviado na segunda-feira. Quando não houver uma pauta específica, a criação pode partir das informações públicas do site, do Instagram e das referências aprovadas.

O Feed deve receber uma legenda em português brasileiro que explique o tema da arte e termine com uma chamada para ação coerente com as informações confirmadas da empresa. O Story pode usar a própria mensagem da arte quando ela for suficiente para orientar o público.

## Compromisso editorial

Toda comunicação da AquiNoSite deve:

- Permanecer fiel às informações disponíveis nas fontes oficiais;
- Diferenciar uma dúvida educativa de uma promessa comercial ou clínica;
- Confirmar dados técnicos e regulatórios na página oficial do produto ou em fonte autorizada;
- Mostrar o produto correto quando uma peça mencionar um modelo específico;
- Usar a logo oficial, preservando símbolo, proporções, grafia, acentuação, cores e espaçamentos;
- Priorizar orientação, precisão e confiança.

## Fontes e data de referência

As categorias, os produtos destacados e o escopo comercial descritos aqui foram consolidados a partir das fontes editoriais disponíveis em **26 de outubro de 2026**. A disponibilidade dos produtos e as condições comerciais devem ser confirmadas no site no momento da consulta.

- [Site oficial da AquiNoSite Saúde](https://www.aquinosite.com.br/)
- [Instagram oficial da AquiNoSite Saúde](https://www.instagram.com/aquinosite.saude/)
- [Sitemap do site oficial](https://www.aquinosite.com.br/sitemap.xml)
