# Landing Page /cervejarias — Veehtor AI

Nova rota pública `/cervejarias` em PT-BR, focada em conversão via WhatsApp, seguindo a identidade visual do veehtor.com.

## Arquivos a criar

- `src/pages/Cervejarias.tsx` — página completa (single-file, com subcomponentes de seção internos para manter tudo local e evitar poluir a base).
- Registro da rota em `src/App.tsx` (`/cervejarias`).

Sem alterações no i18n global do site (a página é PT-BR estática) e sem tocar em `Index.tsx`, `content.json` ou componentes compartilhados.

## Estrutura da página (10 seções + header + footer + FAB WhatsApp)

1. **Header fixo** — logo "Veehtor AI" à esquerda, botão "Falar no WhatsApp" à direita. Glassmorphism escuro.
2. **Hero** (fundo escuro, degradê verde-petróleo sutil) — etiqueta, título serifado com "Menos erro na operação" em itálico verde-menta, subtítulo, CTA primário + link âncora "Ver o que a gente fez ↓".
3. **Barra de prova** (fundo escuro estreito) — texto + placeholder do logo Complô (div bordada com label).
4. **Espelho da dor** (fundo creme, 3 colunas de cards brancos com emoji + título + texto).
5. **A virada** (fundo escuro) — título com "Eles só não dizem nada" em itálico verde + 3 cards horizontais (Economia / Redução / Mitigação).
6. **5 módulos** (fundo creme) — cards numerados 01–05, cada um com dor / o que fazemos / o que muda.
7. **Resultados reais** (fundo escuro) — dois números gigantes serifados em verde-menta ("1 dia → 30 min" e "R$ 100 mil+") + parágrafo de honestidade em itálico.
8. **Como funciona** (fundo creme) — 3 cards brancos numerados.
9. **Precificação por ROI** (fundo escuro) — texto + CTA WhatsApp.
10. **FAQ** (fundo creme) — acordeão usando `@/components/ui/accordion` (shadcn já disponível).
11. **CTA final** (fundo escuro, centralizado) — título com "na sua cervejaria" em itálico + botão.
12. **Rodapé** — © 2026 Veehtor AI LLC · veehtor.com · vitor@veehtor.com.
13. **FAB WhatsApp** — botão flutuante fixo bottom-right, verde-menta, ícone WhatsApp (lucide `MessageCircle` ou SVG inline), visível em toda rolagem.

## Sistema visual (reuso dos tokens existentes)

- Cores: `#0a0c10` (escuro), creme `#f5f0e6`, verde-menta `#2EE6A8`, verde-teal para etiquetas, cinza-claro/escuro para corpo.
- Tipografia: `Instrument Serif` para títulos e números destaque; `DM Sans` para corpo (já carregadas globalmente).
- Etiquetas: `text-xs uppercase tracking-[0.2em] text-[#2EE6A8]`.
- Palavra em itálico verde dentro do título: `<em className="italic text-[#2EE6A8] font-normal">…</em>`.
- Botão primário: bg verde-menta, texto escuro, `rounded-full`, hover suave.
- Cards brancos sobre creme: `bg-white rounded-2xl p-8 shadow-sm`.
- Regra de tipografia do projeto: apenas hífens simples (`-`), nunca en/em dash — vou normalizar os "—" do briefing para " - " no render (ou reescrever as frases mantendo o sentido).

## CTA único

Todos os botões e o FAB apontam para:
`https://api.whatsapp.com/send?phone=5511973022058&text=Oi!%20Vim%20pela%20p%C3%A1gina%20de%20solu%C3%A7%C3%B5es%20pra%20cervejarias%20e%20quero%20entender%20como%20funciona%20pra%20minha%20opera%C3%A7%C3%A3o.`
Constante `WHATSAPP_URL` no topo do arquivo.

## SEO

`<title>Veehtor AI - Operação inteligente para cervejarias</title>` + meta description específica, setados via `useEffect` no topo da página (padrão já usado no projeto).

## Verificação

Após implementar, rodar Playwright headless em `http://localhost:8080/cervejarias`, screenshot desktop + mobile, conferir que todas as seções renderizam, âncora funciona e FAB fica fixo.

## Fora de escopo

- Sem tradução EN, sem integração ao `LanguageContext` global.
- Sem link no menu principal do site (rota "oculta" para prospecção fria, conforme uso descrito).
- Sem envio de logo Complô real — placeholder até você mandar o asset.
