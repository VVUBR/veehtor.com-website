
# Case Studies: alinhamento com a home nova

Objetivo: /case-studies e /case-studies/:slug passam a parecer o mesmo produto da home. Tokens, tipografia, cards, badges e reveals vêm da home. Conteúdo continua vindo de `src/data/caseStudies.ts` sem invenção de dados. Rotas de cliente (/complo, /cervejarias, /adcole, /PodunkAnnies, /family-realty/*) ficam intocadas.

## Fase 1 — Componentes e tokens compartilhados

1. Extrair de `src/pages/Index.tsx` para componentes reutilizáveis:
   - `src/components/site/SiteNav.tsx` — header com logo `v.AI`, links Oportunidades (`/#oportunidades`), Cases (`/case-studies`), Sobre (`/#sobre`), CTA "Mapear meu processo" que abre o MapDialog. Sem seletor PT/EN. Strings via um pequeno objeto local (preparado para i18n futura). Detecta rota: âncoras `#...` navegam para `/#...` quando fora da home.
   - `src/components/site/SiteFooter.tsx` — footer atual da home, mesmas classes.
   - `src/components/site/MapDialogProvider.tsx` — context + provider que monta um único `<MapDialog>` e expõe `useMapDialog().open(source, opener)`. Substitui os refs locais.
2. Mover `MapDialog` de `src/components/home/` para `src/components/site/`. Sem mudança de comportamento (validação, foco, Escape, aria-live).
3. Extrair de `src/styles/home.css` para `src/styles/site.css` os blocos globais: tokens (`:root`), reset básico, fontes, `.wrap`, `.btn*`, `.badge*`, `.reveal`, `.eyebrow`, `.sec-head`, `.scard`, `.nav`, `footer`, `.dark`, `.zone-white`, `.skip`. `home.css` mantém só regras específicas da home (hero, opmap, vals, proof strip, rules, founder, closing, agora). Importar `site.css` no `main.tsx`; `home.css` continua importado só por `Index.tsx`.
4. `App.tsx`: envolver `<Routes>` com `<MapDialogProvider>` para o CTA funcionar em qualquer página.
5. `src/lib/analytics.ts` (`track`) permanece o único helper. Adicionar apenas os eventos novos listados abaixo.

## Fase 2 — Listagem /case-studies

Reescrever `src/pages/CaseStudies.tsx` usando `SiteNav`, `SiteFooter` e as classes compartilhadas.

- Header da página (fora da nav): eyebrow `CASES ENTREGUES`, h2 "10 sistemas em operação. Resultados que aparecem no processo.", `sec-sub` "Cada case informa o que foi resolvido, o que foi medido e a escala em que o sistema opera."
- Grid `cases3` reaproveitando `.scard` da home. Anatomia do card: linha `case-context` (setor · área principal), `case-client` (cliente), h3 (título como resultado — usa `title`), `desc` (usa `summary`, clamp 2 linhas), até 2 métricas em `.m` lado a lado, badge de status, `case-cta` "Ver sistema e resultados" → `/case-studies/{slug}`.
- Desktop 3 colunas, mobile 1 coluna (mesmas media queries da home).
- Ordenação: `RESULTADO MEDIDO` → `RESULTADO OPERACIONAL` → `SISTEMA EM OPERAÇÃO` → `IMPACTO ESTIMADO`.
- Sem filtros, sem busca, sem tags extras.
- Cards com dado insuficiente para as regras acima: em vez de placeholder, renderizar um card "incompleto" listando explicitamente o que falta (fallback visível para eu completar depois). Nada de números inventados.
- Faixa final `.dark` com CTA "Mapear meu processo" (abre MapDialog) + `SiteFooter`.
- SEO por página via hook simples que seta `document.title`, `<meta name="description">` e `<link rel="canonical">` (SPA, sem adicionar dependência nova).
- Eventos: `case_list_viewed` on-mount; `case_clicked` com `{ slug }` no CTA do card.

## Fase 3 — Detalhe /case-studies/:slug

Reescrever `src/pages/CaseStudyDetail.tsx` usando os mesmos componentes e classes.

- Hero: categoria (setor · área), cliente, título como resultado, badge de status, até 3 métricas em `.m`.
- Seções na ordem:
  1. Contexto e gargalo (`challenge`)
  2. O que construímos (`solution`)
  3. O que mudou — antes e depois. Cada `Metric` renderiza com seu badge de classificação individual.
  4. Escala e operação (usa `aboutClient` — sector/size/scale — com selo cinza neutro para números de cobertura/volume).
  5. Nota de honestidade quando existir (novo campo opcional `honesty`).
  6. Próximo case: link para o próximo slug na ordenação, evento `case_next_clicked`.
  7. CTA final "Mapear meu processo".
- SEO: title no formato "{resultado curto} — {cliente} | Veehtor AI", meta description = `seoDescription`, canonical `/case-studies/{slug}`.
- Evento `case_detail_viewed` com `{ slug }` on-mount.
- Sem gráficos decorativos, sem depoimentos fictícios (só renderiza `quote` se presente).

## Regras de prova (bloqueio de conteúdo)

Somente estas classes de badge (adicionadas ao CSS compartilhado):

- `b-medido` — verde — `RESULTADO MEDIDO`
- `b-operacional` — teal — `RESULTADO OPERACIONAL`
- `b-sistema` — teal — `SISTEMA EM OPERAÇÃO`
- `b-estimado` — laranja — `IMPACTO ESTIMADO`
- `b-escala` — cinza neutro — para escala, cobertura, volume, disponibilidade

Nunca aplicar `b-medido` a projeção, escala, número de usuários ou disponibilidade. Nunca chamar capacidade liberada de economia.

## Extensão do tipo (aguarda aprovação antes de publicar)

`caseStudies.ts` hoje não tem status por case nem classificação por métrica. Vou estender:

```ts
export type ProofClass =
  | "medido" | "operacional" | "sistema" | "estimado" | "escala";

export interface Metric {
  value: LS; label: LS;
  estimated?: boolean;
  proof: ProofClass; // novo, obrigatório
}

export interface CaseStudy {
  // ...
  status: ProofClass;      // novo — dirige badge do card e ordenação
  honesty?: LS;            // novo — nota opcional ("aprovação final continua humana", etc.)
}
```

Antes de publicar, entrego uma tabela com a classificação proposta (`status` do case + `proof` de cada métrica dos 10 cases) para você aprovar em uma passada. Só depois trocamos os dados.

## Ligações com a home

- Os 3 `stat` cards do bloco Proof e os 3 `scard` do bloco Cases em `Index.tsx` passam a apontar para os slugs corretos (D.Carvalho, CERVEJARIA COMPLÔ, Robbin Services). Fonte dos href: `homeContent.ts` — não invento slug, uso os existentes em `CASE_STUDIES`.
- "Ver os 10 sistemas entregues" e "Ver os cases entregues" continuam apontando para `/case-studies`.

## Técnica, acessibilidade, analytics

- Sem framer-motion, sem GSAP. Reveals com o mesmo IntersectionObserver da home (extraído para `useReveal` em `src/hooks/useReveal.ts`, threshold `.12`, rootMargin `0px 0px -40px 0px`, respeita `prefers-reduced-motion`).
- Skip link, foco visível, contraste AA, links como `<a>/Link`, botões como `<button>`.
- Eventos novos, mesmos nomes: `case_list_viewed`, `case_clicked({slug})`, `case_detail_viewed({slug})`, `case_next_clicked({from,to})`. Eventos do MapDialog continuam iguais.
- `bun run build` deve passar. Preview para comparação. **Não publicar automaticamente.**

## Fora de escopo

- Rotas de cliente `/complo`, `/cervejarias`, `/adcole`, `/PodunkAnnies`, `/family-realty/*`: intocadas.
- Sem filtros/busca/tags extras na listagem.
- Sem seletor de idioma na nav.
- Sem novas dependências.

## Ordem de execução

1. Extrair `SiteNav`, `SiteFooter`, `MapDialogProvider` e `site.css`; refatorar `Index.tsx` para consumi-los (sem mudança visual na home).
2. Estender o tipo de `caseStudies.ts` e enviar tabela de classificação para aprovação.
3. Após aprovação, popular `status`/`proof`/`honesty` e reescrever `CaseStudies.tsx` e `CaseStudyDetail.tsx`.
4. Atualizar hrefs de proof/cases em `homeContent.ts` para os slugs corretos.
5. Build + preview.
