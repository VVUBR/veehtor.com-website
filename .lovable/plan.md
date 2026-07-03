## Problema

O link `api.whatsapp.com/send?phone=...` está sendo bloqueado pelo navegador (ERR_BLOCKED_BY_RESPONSE). Isso acontece porque o `api.whatsapp.com` retorna headers (como `X-Frame-Options`) que impedem a abertura em certos contextos — especialmente dentro de iframes de preview (Lovable, redes sociais, alguns navegadores mobile).

A solução recomendada pelo próprio WhatsApp é usar o domínio curto oficial **`wa.me`**, que é feito exatamente para links de clique-para-conversar e não sofre esse bloqueio.

## Alteração

Trocar o link do WhatsApp em `src/pages/Cervejarias.tsx`:

- **De:** `https://api.whatsapp.com/send?phone=5511973022058`
- **Para:** `https://wa.me/5511973022058`

Aplica-se aos 3 pontos que já usam a constante `WHATSAPP_URL`:
1. Botão "Falar no WhatsApp" no Hero
2. Botão flutuante (FAB) "Falar no WhatsApp"
3. Botão "Quero fazer essa conta" na seção de precificação

Como todos usam a mesma constante, é uma única linha alterada.
