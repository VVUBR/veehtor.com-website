# Revisão completa dos Case Studies

Reescrita do conteúdo dos 10 cases (PT/EN), anonimização dos clientes, nova ordem editorial, novos endereços com compatibilidade dos antigos, e ajustes de hierarquia no catálogo e nas páginas de detalhe. Identidade visual, filtros, navegação e fluxo de contato atuais são preservados.

## Fonte única de conteúdo

Todo o conteúdo continua em `src/data/caseStudies.ts`, que já alimenta catálogo, detalhe e cartões da home. Ajustes no modelo de dados:

- `client` passa a ser localizado (`LS`): "Rede de concessionárias de máquinas agrícolas" / "Agricultural equipment dealership network", "Empresa de serviços elétricos nos EUA" / "US electrical contractor", "Instituto de apoio a organizações sociais" / "Nonprofit support organization", "Cervejaria com vários pontos de venda" / "Multi-location brewery".
- `clientId` novo: identifica a organização (4 organizações, 10 módulos) e gera o bloco "Outras implementações nesta operação".
- `order` novo: ordem editorial fixa, igual nos dois idiomas, aplicada também com filtros ativos (substitui a ordenação por `STATUS_RANK`).
- `bottleneck`, `implemented`, `changed`: renomeiam/substituem `challenge`, `solution`, `result` com os textos fornecidos.
- `highlights`: até 2 destaques qualitativos por case (substitui a tripla obrigatória `metrics`).
- `metrics` passa a ser opcional (0 a 2), somente para números com documentação confirmada.
- `cta`: pergunta específica do case, com botão que abre o fluxo de contato atual (MapDialog).
- `slug` novo + `legacySlugs` com o identificador antigo.
- `measurement` opcional: "Como medimos" / "Measurement scope". O rótulo "Nota de honestidade" é removido.

## Números

Não há no projeto registro de fonte, período, escopo, amostra, fórmula e autorização para nenhum dos indicadores atuais. Portanto, por padrão da própria instrução, os cases entram com **títulos e destaques qualitativos**, sem placar numérico. Os números atuais (5-7 dias, R$30 mil/ano, 74%, 100%, US$300-500/semana, ~4.000 clientes, +50% de ticket etc.) saem da interface pública.

As variantes numéricas ficam registradas fora da interface, em `docs/case-metrics-pending.md`, com o que precisa ser documentado para cada uma. Se você confirmar a documentação de algum indicador, ele é promovido depois com uma alteração pontual.

## Novos endereços e compatibilidade

| Antigo | Novo |
| --- | --- |
| dcarvalho-credit-scoring | agricultural-equipment-credit-analysis |
| robbin-field-productivity | electrical-contractor-field-productivity |
| phomenta-grant-prospecting | nonprofit-grant-screening |
| phomenta-linkedin-leads | nonprofit-outreach-research |
| robbin-receivables-cash | electrical-contractor-receivables |
| complo-time-tracking | multi-location-brewery-time-tracking |
| robbin-payroll | electrical-contractor-payroll |
| complo-ai-checklists | multi-location-brewery-checklists |
| complo-ai-dashboard | multi-location-brewery-management-dashboard |
| complo-customer-voice | multi-location-brewery-customer-reviews |

O site é uma aplicação de página única, sem servidor: não é possível emitir um redirecionamento HTTP 301. O endereço antigo passa a redirecionar no próprio navegador para o novo (substituindo o histórico) e a página antiga não é indexada separadamente, porque o canonical aponta sempre para o endereço novo. Essa limitação será informada na entrega.

## Catálogo

- Abertura e filtros mais compactos, para os cases aparecerem antes na rolagem.
- Cartão: setor e área, descritor do cliente, título sobre a mudança no processo, resumo, até 2 destaques, link "Ver o case completo" / "Read the case study".
- Sem selo de prova quando não há métrica documentada; sem título truncado (altura do cartão acomoda PT e EN).
- Os três primeiros cases recebem destaque visual (cartão mais largo/tipografia maior), sem duplicá-los na lista.
- Filtros por setor e área mantidos, funcionando nos dois idiomas e preservando a ordem editorial.
- Abertura e fechamento com os textos fornecidos; botão "Conversar com a Veehtor" / "Talk to Veehtor" abre o fluxo de contato atual.

## Detalhe

Ordem: cliente/setor/área, título, resumo, destaques, "O gargalo", "O que implementamos", "O que mudou", "Como medimos" (quando houver), CTA do case, "Outras implementações nesta operação", próximo case pela nova ordem. O placar deixa de ser repetido duas vezes na página.

## Metadados e idiomas

- Aba: "[título conciso] | Veehtor AI"; description derivada do resumo, sem resultados.
- Open Graph e dados estruturados atualizados com o descritor anonimizado; nenhum nome antigo em metadados, textos alternativos ou imagens.
- Canonical por case apontando para o endereço novo.
- Novo `public/sitemap.xml` gerado por `scripts/generate-sitemap.ts` (hooks `predev`/`prebuild`), com o catálogo e os 10 endereços novos.
- A troca de idioma mantém o visitante no mesmo case (o idioma não faz parte do endereço, então isso já vale; será verificado).

## Outras superfícies

`src/i18n/homeContent.ts` (cartões da home) passa a usar os descritores anonimizados e os endereços novos. Rodapé e navegação continuam apontando para `/case-studies`.

## Detalhes técnicos

- Arquivos alterados: `src/data/caseStudies.ts`, `src/pages/CaseStudies.tsx`, `src/pages/CaseStudyDetail.tsx`, `src/i18n/siteContent.ts`, `src/i18n/homeContent.ts`, `src/styles/home.css`, `scripts/generate-sitemap.ts` (novo), `package.json`, `docs/case-metrics-pending.md` (novo).
- `sortedCases()` passa a ordenar por `order`; `getStatus`/`PROOF_LABELS` permanecem mas só são usados quando há métrica documentada.
- Resolução de slug no detalhe: procura por `slug`, depois por `legacySlugs`, e nesse caso navega para o novo endereço com `replace`.
- Eventos de medição atuais (`case_clicked`, `case_detail_viewed`, `case_filter_changed`, `case_next_clicked`) preservados.
