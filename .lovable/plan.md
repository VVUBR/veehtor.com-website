## Substituir placeholder "logo Complô" na página /cervejarias

### Objetivo
Inserir o logo da Cervejaria Complô (arquivo `logo_oficial_1.pdf` enviado) no placeholder localizado na seção "Projeto real, resultado real" da página `/cervejarias`.

### Passos
1. **Converter o PDF para imagem web**
   - Extrair/Converter a primeira página do PDF para PNG com fundo transparente, resolução adequada para web (aprox. 400-600px de largura).
   - Verificar visualmente se o logo ficou legível e sem fundo indesejado.

2. **Hospedar via Lovable Assets**
   - Fazer upload do PNG gerado via `lovable-assets create` para criar um ponteiro `.asset.json` em `src/assets/`.
   - Remover qualquer arquivo binário temporário do repositório após o upload.

3. **Atualizar o componente `ProofBar` em `src/pages/Cervejarias.tsx`**
   - Substituir o bloco placeholder (linha 207-212) por uma `<img>` que importa o `.asset.json` e exibe o logo.
   - Aplicar ajustes de altura máxima e object-fit para manter o visual consistente com o layout atual (caixa arredondada, centralizada).

4. **Verificar**
   - Executar `bun run build` para garantir que não há erros de importação ou sintaxe.
   - Validar visualmente no preview se o logo aparece no lugar correto e bem dimensionado.

### Observação técnica
O PDF precisa ser convertido para PNG/SVG porque navegadores não renderizam PDFs diretamente em elementos `<img>` de forma confiável. O resultado final será uma imagem otimizada servida pelo CDN da Lovable.