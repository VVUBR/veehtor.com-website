Corrigir a renderização visual do logo "v.AI" no header para que apareça como um único elemento contíguo, sem espaços entre v, . e AI.

**Problema confirmado**: Em `src/components/site/SiteNav.tsx:59-61` o logo é um único `<Link>` com três filhos de texto/span: `v<span className="dot">.</span>AI`. Apesar de ser um único link, a separação em spans pode causar espaçamento visual ou dar a impressão de elementos clicáveis separados.

**Mudança proposta**:
1. Em `SiteNav.tsx`, envolver o texto "v.AI" em um `<span>` único dentro do `<Link className="logo">`, mantendo o ponto laranja via classe no span interno. Isso garante que o conjunto seja tratado como um bloco visual único.
2. Ajustar o CSS em `src/styles/home.css` para garantir `white-space: nowrap` no logo e evitar quebra/entrelinha que possa parecer separação. Manter `letter-spacing: -0.06em` já existente.

**Escopo**: Apenas o componente `SiteNav.tsx` e o estilo `.home .logo` no `home.css`. Nenhuma outra alteração de funcionalidade.

**Validação**: Verificar no preview que o header exibe "v.AI" sem espaços visuais entre os caracteres e que o link continua navegando para `/`.