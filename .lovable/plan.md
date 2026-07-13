## Adicionar fotos reais da Complô em 3 seções da página /cervejarias

Sem alterar nenhum texto. Apenas visual.

### 1. Hospedar as 3 fotos via Lovable Assets
Fazer upload das imagens de `/mnt/user-uploads/` para o CDN e gerar pointers em `src/assets/`:
- `complo-tap.jpg` — copo na chopeira (vertical, para o Hero)
- `complo-garden.jpg` — beer garden externo (para a ProofBar)
- `complo-cheers.jpg` — duas pessoas brindando (para a FinalCTA)

### 2. Hero — foto ao lado do texto
Transformar o container do Hero em grid de 2 colunas em desktop (`md:grid-cols-[1fr_auto]` ou `1.2fr_1fr`), texto à esquerda (Label, título, parágrafo, CTAs) e a foto vertical `complo-tap.jpg` à direita:
- `rounded-2xl`, `object-cover`, altura ~ 480–560px
- overlay/máscara com gradiente escuro nas bordas (via `box-shadow inset` ou `::after` com `radial-gradient`) para integrar ao fundo escuro
- levemente escurecida (`brightness-90`)
- Em mobile, empilha abaixo do texto.

### 3. ProofBar — foto como fundo do card do logo
Substituir o card tracejado atual por um card com `complo-garden.jpg` de fundo:
- `background-image` + `bg-cover bg-center`, `rounded-xl`
- overlay escuro 70% (`rgba(10,12,16,0.7)`)
- **remover** `border-2 border-dashed`
- logo branco `complo-logo-white.png` centralizado por cima
- manter proporções semelhantes ao card atual (mín. ~180px de largura, padding generoso)

### 4. FinalCTA — foto como fundo da seção
Adicionar `complo-cheers.jpg` como background da `<section>`:
- `bg-cover bg-center`
- overlay escuro 80–85% (`rgba(10,12,16,0.82)`) via pseudo-elemento ou div absoluta
- manter o gradiente radial verde-mint atual por cima do overlay para preservar o clima
- conteúdo (Label, título, parágrafo, CTA) permanece no z-index acima, sem mudança de cor

### 5. Verificação
- `bun run build`
- Screenshot via Playwright do Hero, ProofBar e FinalCTA para confirmar legibilidade, escurecimento coerente e ausência da borda tracejada.

### Nota técnica
Todo o CSS fica inline/Tailwind dentro de `src/pages/Cervejarias.tsx`. Nenhum texto é alterado. Nenhuma outra seção recebe imagem.
