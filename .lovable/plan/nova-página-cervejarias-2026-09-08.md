# Nova página /cervejarias

Reescrita completa da página, com a copy do documento aplicada literalmente, nova identidade visual e nova estrutura. A rota `/cervejarias` e a âncora `#case` continuam iguais.

## Decisões já tomadas

- Não haverá seção Investimento.
- O formulário não grava lead no banco: ao enviar, abre o WhatsApp com o resumo preenchido e mostra a tela de confirmação.
- As fotos atuais da Complô e a foto do Vitor continuam na página.

## Identidade visual

- Cores: azul-marinho #111828 (dominante), teal #15B7A8, laranja #F87316 (uma ou duas vezes por seção), verde #21C65D só no número financeiro, texto #030619 sobre claro, fundos claros #E6E7E9 e #DBDCE0, teal escuro #0E8F84 para texto colorido sobre fundo claro.
- Tipografia Carlito (títulos, bold) e Inter (corpo), via Google Fonts. Escala: H1 48 a 64px desktop e 32 a 40px celular; H2 32 a 40px; chapéu 13 a 15px caixa alta; corpo 17 a 19px; número herói 44 a 64px; legendas 13 a 14px.
- Sem barra de acento sob título, sem faixa lateral, sem gradiente decorativo. Logo sem caixa, sem borda, sem sombra, versão certa para cada fundo.
- Alternância de fundo escuro e claro entre seções, conteúdo centralizado, largura de texto entre 68 e 75 caracteres.
- Celular primeiro, com verificação do hero e do bloco de número em tela de 390px.

## Seções, nesta ordem

1. Header: logo à esquerda, botão "Falar sobre minha operação" que rola até o formulário.
2. Hero (#111828): chapéu, H1, subtítulo, botão principal, link "Ver o que construímos na Cervejaria Complô" (âncora #case) e linha de apoio em 14px.
3. O problema (#E6E7E9): três cards.
4. Para quem isto foi feito (#111828): duas colunas, "Faz sentido se" com marcador teal e "Não faz sentido se" com marcador cinza, mais a linha de fechamento.
5. A prova, âncora #case (#E6E7E9): dois parágrafos, bloco de número "Folha de freelancers / De 1 dia para 15 min por semana" com o numeral em #21C65D, etiqueta de medição em 13px, parágrafo de fechamento, logo da Complô e foto da operação.
6. Como funciona (#111828): quatro etapas numeradas 01 a 04 com numeral em teal, mais a linha de fechamento em destaque.
7. Uma rotina por vez (#15B7A8 sólido, texto #111828): só título e parágrafo, sem ornamento.
8. O que a gente não faz (#E6E7E9): lista com marcador e citação do Vitor com a foto ao lado.
9. Perguntas frequentes (#E6E7E9): as oito perguntas na ordem do documento.
10. Chamada final (#111828): parágrafo e formulário com Nome, Nome da cervejaria, Quantas unidades, WhatsApp, Qual rotina está travando, O que você já tentou. Botão "Enviar". Depois do envio, tela de confirmação com o atalho "Quer adiantar? Chama no WhatsApp."
11. Rodapé: logo, ano, veehtor.com, vitor@veehtor.com.

## Regras de texto aplicadas

- Sem travessão, sem asterisco, acentuação completa.
- Fora as palavras proibidas: módulo, pacote, AI Audit, Raio-X de IA, diagnóstico vendido à parte, quick win, transformação completa.
- Nenhum número novo além dos que estão no documento. O bloco de número da Complô fica literal.
- Texto alternativo em toda imagem descrevendo a cena da operação.
- Sem depoimento, selo, contador de clientes, logo de parceiro ou garantia de reembolso.

## Notas técnicas

- Reescrever `src/pages/Cervejarias.tsx` inteiro; nenhuma outra página muda.
- Tokens de cor e fontes locais à página, sem tocar no tema global do site.
- Carregar Carlito e Inter no `index.html`.
- Envio do formulário: monta a mensagem com os campos e abre `wa.me` em nova aba, depois troca o bloco pela confirmação. Validação simples de campos obrigatórios, sem chamada de rede.
- Manter o title e a description próprios da página.
