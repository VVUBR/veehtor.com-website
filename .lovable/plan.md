Plano final: conectar o formulário ao endpoint do Apps Script.

### Endpoint
`https://script.google.com/macros/s/AKfycbyK9drTn1ojx4NyPcyDWKJkbYrHUKrFJnpN2XOJYWhe9RDbDrSBXO_XfzA-xXUFIPxQ5g/exec`

### Mudanças

**1. `src/lib/submitProcessMapping.ts`** — reescrever para fazer POST real:
- URL do Apps Script fixa como constante no arquivo (é pública mesmo).
- `fetch` com `Content-Type: text/plain;charset=utf-8` para evitar preflight CORS (o Apps Script continua lendo o JSON via `e.postData.contents`).
- Payload: `{ nome, empresa, email, telefone, processo, impactos }` — `impactos` como string única separada por vírgulas.
- Retorna `{ ok: false }` em erro de rede/HTTP; mantém a mesma interface, então `MapDialog` não precisa mudar de forma nenhuma.

**2. `src/components/home/MapDialog.tsx`** — traduzir os impactos antes de enviar:
- Hoje envia os `value` técnicos (`revenue_loss`, etc.). Passar a enviar os `label` do idioma atual (já disponíveis em `S.impacts` via `useSiteContent`), mapeando cada checkbox marcado para o `label` correspondente. Nada mais muda.

### Fora do escopo
- Sem Supabase, sem Edge Function, sem conector, sem `.env` novo.
- Tratamento de erro já existente (`errNetwork`) continua cobrindo falhas.

### Teste
Após o build, abrir o modal no preview, enviar um teste e conferir a linha nova na planilha.
