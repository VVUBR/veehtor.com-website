
# Site bilíngue EN / PT-BR com seletor de bandeiras

## Escopo

A landing page principal (`/`) é `src/pages/Index.tsx`, com todo o texto inline. Esta tarefa internacionaliza essa página + o seletor de bandeiras no header dela. As demais rotas (`/privacy`, `/terms`, `/complo`, `/PodunkAnnies`, `/Score.de.credito.DCarvalho`, `/denis-energia-solar`) ficam fora do escopo.

Nada de design muda: mesmas cores, fontes, layouts, animações, espaçamentos e CTAs. A única adição visual é o par de bandeirinhas no header.

## Arquivos novos

1. **`src/i18n/LanguageContext.tsx`**
   - Estado `language: 'en' | 'pt'`, default `'en'`.
   - Hidrata de `localStorage.getItem('veehtor-lang')` no mount; se inválido/vazio, fica `'en'`.
   - `setLanguage(lang)` persiste em `localStorage` e atualiza `document.title` + `<meta name="description">` para a versão correspondente.
   - Hooks: `useLanguage()` (lang + setter) e `useT()` (retorna o dicionário ativo).

2. **`src/i18n/translations.ts`**
   - Dicionário tipado com raízes `en` e `pt`, cobrindo TODO texto visível da landing:
     - Header (nav links, CTA, aria-labels das bandeiras).
     - Loader.
     - Hero 3 fases (manchetes, parágrafos, indicador "Scroll", botão final).
     - `painCards` (20 chips), `rotatingWords` (4 palavras), `marquee`.
     - Problem (heading + 3 cards).
     - Outcomes (label, heading, sub, `stats` x4 com label e desc).
     - Process (label, heading, `steps` x3 com title, timeline, desc).
     - Cases (label, heading, `cases` x3 com industry, metric, metricLabel, desc, before, after).
     - Pricing (heading, sub, cards e bullets).
     - FAQ (verificar o restante do arquivo antes de implementar).
     - Final CTA, formulário (placeholders/labels) e footer.
     - `meta`: `{ title, description }`.
   - EN copiado literalmente do código atual (sem reescrita).
   - PT-BR: tradução natural, persuasiva, marketing-style.
     - "Veehtor AI" não traduzido.
     - "AI that pays for itself" → "IA que se paga sozinha".
     - Termos consagrados (AI, ROI, dashboard, pipeline, follow-up, lead, SaaS) mantidos em inglês quando soar natural.
     - APENAS hífens simples `-` (sem en/em dashes), conforme regra do projeto.
   - Tipo `Translations = typeof translations.en`, com `translations.pt: Translations` para garantir paridade em build.

3. **`src/components/LanguageSwitcher.tsx`**
   - Dois botões com SVGs inline das bandeiras BR e US (sem libs externas, sem emoji).
   - ~22x16px, `rounded-sm`, gap pequeno.
   - Ativo: `opacity-100` + `ring-1 ring-white/60`. Inativo: `opacity-50 hover:opacity-100`.
   - `aria-label` "Switch to English" / "Mudar para português", `aria-pressed` no ativo, foco visível por teclado.

## Arquivos editados

4. **`src/main.tsx`** — envolver `<App />` em `<LanguageProvider>`.

5. **`src/pages/Index.tsx`**
   - Trocar todas as strings hardcoded por `t.*` do hook `useT()`.
   - **Mover** `PAIN_CARDS`, `ROTATING_WORDS`, `STATS`, `STEPS`, `CASES` (e quaisquer outros arrays de conteúdo) para dentro do componente, cada um derivado via `useMemo(() => [...], [language])`. Isso mantém referência estável por idioma, evitando que a animação de palavras girando, o marquee e os reveals reiniciem a cada render.
   - Adicionar `<LanguageSwitcher />` no header, à direita após o botão "Get in touch", visível em desktop e mobile (o header atual não tem hambúrguer, então fica sempre visível).
   - `useEffect([language])` que sincroniza `document.title` e `<meta name="description">`.

6. **`index.html`** — meta description default permanece em EN; o contexto atualiza no client.

## Notas técnicas

- Sem libs novas. SVGs de bandeira inline.
- Persistência: `localStorage` key `veehtor-lang`.
- Troca de idioma instantânea via contexto, sem reload.
- Se você quiser depois estender para as outras rotas, é uma tarefa separada.

## Arquivos tocados

- novos: `src/i18n/LanguageContext.tsx`, `src/i18n/translations.ts`, `src/components/LanguageSwitcher.tsx`
- editados: `src/main.tsx`, `src/pages/Index.tsx`
