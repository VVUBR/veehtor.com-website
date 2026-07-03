## Plan: Text edits on `/cervejarias` landing page

Apply exactly the 7 changes below. No other modifications.

### 1. Global — Remove all em dashes
Scan every string in `src/pages/Cervejarias.tsx` and replace every `—` with a comma or period as grammar requires. No em dash may remain.

### 2. Hero — New subtitle
Replace the `<p>` under `TitleWithItalic` in the `Hero` section with this exact text:

> "Trabalhamos 3 meses dentro da operação da Complô, uma rede de 5 cervejarias, e colocamos tudo num painel só. A folha de pagamento que tomava um dia inteiro do gerente toda semana hoje leva cerca de 2 horas no mês. A empresa e os colaboradores ganharam segurança jurídica. E a qualidade de cada abertura e fechamento passou a ser acompanhada por IA. Queremos fazer o mesmo pela sua cervejaria, e só faz sentido pra gente se fizer sentido pra você."

### 3. "A solução" section — Replace 3 cards
In `TheShift`, replace the `cards` array so the three cards become:

- **Card 1** — title: `Economia de tempo`, body: `Folha de pagamento, relatórios e conferências deixam de ser trabalho manual e passam a rodar sozinhos.`
- **Card 2** — title: `Economia de dinheiro`, body: `Risco trabalhista documentado, equipe do tamanho certo pro movimento, compras e promoções guiadas pelo que os dados mostram.`
- **Card 3** — title: `Mitigação de erros`, body: `Evitamos que análises e conclusões sejam feitas de maneira errada. Os planos de ação são traçados a partir de informações reais da operação, e qualquer desvio de padrão gera alerta no WhatsApp na hora.`

### 4. Module 01 — New title and "O que fazemos" paragraph
In the first item of the `modules` array inside `Modules`:
- Change `title` to: `Registro de ponto, freelancers e segurança jurídica`
- Change `faz` to: `O colaborador bate o ponto pelo aplicativo, com verificação por GPS, então só registra quem está de fato na unidade. No primeiro login, o freelancer assina um contrato digital que fica guardado no sistema. As horas se registram sozinhas e a folha chega pronta pro financeiro.`

### 5. Results section — Remove italic disclaimer and update first stat
In `RealResults`:
- Remove the italic `<p>` that says the implementation is recent and indicators are being measured.
- Update the first stat block:
  - Number: `1 dia/semana → 2h/mês`
  - Label: `FOLHA DOS FREELANCERS`
  - Body: `O fechamento que tomava um dia inteiro do gerente toda semana hoje leva cerca de 2 horas no mês.`

### 6. Final CTA — New headline, text, and button label
In `FinalCTA`:
- `TitleWithItalic` `before`: `Bora conversar sobre `, `italic`: `a sua cervejaria`, `after`: `?`
- Body paragraph: `Manda uma mensagem pra gente no WhatsApp, é só clicar no botão aqui embaixo. A conversa é sobre a sua operação, rápida e sem compromisso.`
- Button text: `Manda um oi pra gente`

### 7. WhatsApp button labels
- Hero CTA and floating FAB: keep `Falar no WhatsApp`
- Pricing section CTA: change button text to `Quero fazer essa conta`
- All buttons continue linking to the same `WHATSAPP_URL`

### Verification
Run `bun run build` after all edits to confirm zero TypeScript or compilation errors.