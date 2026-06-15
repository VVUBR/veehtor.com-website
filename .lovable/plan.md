# Family Realty Holdings — Dashboard de Controle de Custos

Preview visual com dado fictício, acessível em uma nova rota dentro do projeto atual.

## Rota e acesso

- Nova rota SPA: `/family-realty` (registrada em `src/App.tsx`, antes do catch-all).
- Sem auth, sem persistência, sem backend. Reload reseta filtros.
- O domínio `family-realty.veehtor.com` (subdomínio real) não é configurado por código — é DNS + Custom Domain no painel Lovable. Eu entrego a rota; depois você conecta o subdomínio em Project Settings → Domains apontando para este projeto (ou publicamos como projeto separado, se preferir). Ver pergunta no fim.

## Identidade visual

Tokens dedicados (escopo isolado, não afetam o site Veehtor):
- Aplicados via classe wrapper `.family-realty` na página, definindo CSS vars locais.
- Cores: `--fr-navy #041C2C`, `--fr-gold #EAAA00`, `--fr-text #2C2C2C`, `--fr-muted #808080`, `--fr-bg #FFFFFF`, `--fr-surface #F3F5F8`, `--fr-green #2E7D52`, `--fr-red #B70200`.
- Fontes: Roboto (700/900) headings, Lato (400/700) body, carregadas via `<link>` injetado só nesta página (não global).
- Raio 8px, light mode, header navy, tipografia generosa.

## Estrutura da página

```text
┌────────────────────────────────────────────────────────────┐
│ HEADER NAVY  [logo FR] Controle de Custos por Obra  [filtros período] │
├────────────────────────────────────────────────────────────┤
│ KPI1  KPI2  KPI3(gold)  KPI4(red?)  KPI5(red?)             │
├──────────────────────────────┬─────────────────────────────┤
│ Budget vs Realizado por obra │ Agenda de desembolsos /semana│
│ (horizontal bars, 8 linhas)  │ (colunas 8–12 semanas)      │
├──────────────────────────────┴─────────────────────────────┤
│ Realizado por etapa (donut)  │ (espaço para legenda)       │
├────────────────────────────────────────────────────────────┤
│ Tabela: Data Obra Fornecedor Tipo Etapa Valor Status       │
│ Filtros: Obra ▾  Status ▾   (sort por header)              │
├────────────────────────────────────────────────────────────┤
│ "Preview visual com dado fictício..." (cinza, pequeno)     │
└────────────────────────────────────────────────────────────┘
```

### Header
- Background `--fr-navy`, texto branco.
- Esquerda: placeholder "Family Realty" (caixa branca outline, mesmo footprint do logo futuro).
- Centro: título "Controle de Custos por Obra".
- Direita: 4 botões filtro período — "Esta semana", "Este mês", "Próximas 12 semanas", "Tudo". Ativo em gold.

### KPIs (5 cards)
1. Budget total (obras ativas) — USD grande.
2. Realizado — USD + % do budget + seta variação vs período anterior (verde/vermelho).
3. A desembolsar (próximos 30 dias) — número em gold.
4. Pagamentos em alerta — contagem, vermelho se > 0.
5. Compliance a vencer (30 dias) — contagem, vermelho se > 0.

Cada card: label cinza topo, número grande, indicador variação.

### Gráficos (Recharts, já compatível com stack)
- **Budget vs Realizado por obra**: BarChart horizontal, 2 séries (navy/gold). Barra realizado vira vermelha se > budget.
- **Agenda de desembolsos**: BarChart colunas, 8–12 semanas no eixo X, stacked por obra (paleta derivada de navy/gold/neutros).
- **Realizado por etapa**: Donut (PieChart) — Fundação, Estrutura, Elétrica, Hidráulica, Drywall, Acabamento.
- Tooltips com valor exato em USD.

### Tabela
- Colunas: Data, Obra, Fornecedor, Tipo, Etapa, Valor, Status.
- Sort ao clicar header (asc/desc).
- Filtros dropdown: Obra, Status.
- Linha "Em alerta": fundo vermelho 6% opacidade. "Pago": dot verde. "A pagar": dot cinza.
- Sem paginação pesada: scroll vertical interno com ~150 linhas.

### Rodapé
Texto cinza pequeno: "Preview visual com dado fictício. A versão final terá dado real das obras e a identidade visual completa da Family Realty."

Botão decorativo "Exportar" disabled no canto, conforme pedido.

## Dado fictício (gerado em arquivo, determinístico)

`src/pages/family-realty/data.ts`:
- 8 obras: Melrose, Barrington NH, Merrimack, Putnam Triplex, Brighton, Westford MA, Lexington MA, Carlisle MA. Budget aleatório entre 280k–1.2M (seed fixa), realizado 35%–110% (2 acima de 100%).
- ~150 line items últimos 90 dias + ~40 pagamentos futuros próximos 12 semanas.
- Suppliers materiais: Home Depot, Lowe's, Lansing Building Products, 84 Lumber.
- Subs: Rivera Electric LLC, Coastal Plumbing Co, Granite State Framing, BayState Drywall.
- Stages: 6 listadas.
- Variabilidade: semanas pesadas e fracas; 3–5 pagamentos off-term; 2 compliances vencendo.
- Gerador com PRNG semeado (mulberry32) para resultados estáveis a cada reload.

## Comportamento de filtros

- Filtro período no header re-deriva KPIs, gráficos e tabela via `useMemo`.
- Filtros Obra e Status na tabela são locais à tabela.
- Sort: estado local `{column, dir}`.

## Arquivos a criar

```text
src/pages/family-realty/
  index.tsx              # página principal (wrapper .family-realty)
  data.ts                # gerador determinístico de dados
  theme.css              # CSS vars + fontes Family Realty (escopo .family-realty)
  components/
    FRHeader.tsx
    KpiCard.tsx
    BudgetVsRealizadoChart.tsx
    DisbursementScheduleChart.tsx
    StageDonut.tsx
    CostTable.tsx
```

Alteração mínima em `src/App.tsx`: adicionar `<Route path="/family-realty" element={<FamilyRealty />} />` antes do `*`.

Nada mais é tocado (sem mudanças em Veehtor landing, i18n, etc.).

## Detalhes técnicos

- Recharts (instalar se ainda não estiver) para todos os gráficos.
- Tailwind: usar arbitrary values `bg-[#041C2C]` e classes utilitárias; cores também expostas como CSS vars para reuso.
- Formato moeda: `Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 })`.
- Datas: `Intl.DateTimeFormat('pt-BR')` curto.
- Responsivo: grid `lg:grid-cols-5` KPIs, `lg:grid-cols-2` gráficos secundários; abaixo de `lg` empilha. Sem scroll horizontal em 1280+.
- Acessibilidade básica: contraste OK navy/branco, gold sobre branco apenas em números grandes.

## O que NÃO entra

- Sem "saldo em caixa" ou cash flow.
- Sem login, sem API, sem persistência, sem CRUD, sem export real.
- Sem ícones decorativos sem função.

## Pergunta antes de implementar

Quer que o `/family-realty` viva **dentro deste mesmo projeto Veehtor** (rota interna, e depois você aponta `family-realty.veehtor.com` como custom domain extra para este projeto) — ou prefere que eu te oriente a **duplicar como projeto Lovable separado** para o subdomínio ficar isolado da landing? A implementação da rota é a mesma; muda só o passo de DNS/publish depois.
