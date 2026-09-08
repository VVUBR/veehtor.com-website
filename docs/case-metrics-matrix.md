# Matriz de métricas pendentes de validação (cases Veehtor)

Uso interno. Não contém evidência confidencial: apenas o que precisa ser confirmado
para ativar cada número na página pública. Nada aqui aparece no site.

Enquanto um indicador não estiver confirmado, o case fica na versão qualitativa já
publicada. Nenhuma métrica é ativada automaticamente; a ativação exige preencher
todos os campos e editar o registro do case em `src/data/caseStudies.ts`.

Exigência por tipo de dado:
- Cobertura de unidades: confirmação de quantas unidades usam, desde quando e por quem foi verificado.
- Tempo de ciclo: fonte, período comparado, escopo da comparação e amostra.
- Economia estimada: além do acima, fórmula, premissas e taxa/salário usados.
- Toda métrica: autorização explícita de divulgação pelo cliente.

---

## 1. Rede de concessionárias de máquinas agrícolas - análise de crédito

**Indicador A - tempo de decisão de crédito (5 a 7 dias para minutos)**
- O que mede: intervalo entre a solicitação e a recomendação disponível ao comitê.
- Documentado no projeto: nada localizado.
- Falta confirmar: como o prazo anterior foi apurado, período comparado, amostra de propostas, tempo atual observado.
- Fonte e período: a definir com o cliente.
- Autorização: pendente.
- Texto público quando confirmado: "5 a 7 dias para minutos - tempo até a recomendação de crédito" / "5 to 7 days to minutes - time to a credit recommendation". Classe: resultado medido.

**Indicador B - uso em 8 de 10 concessionárias**
- O que mede: cobertura de adoção na rede.
- Documentado no projeto: nada localizado.
- Falta confirmar: lista de unidades ativas, data da verificação, critério de "em uso".
- Autorização: pendente.
- Texto público quando confirmado: "8 de 10 concessionárias" / "8 of 10 dealerships". Classe: escala de operação.

## 2. Empresa de serviços elétricos - produtividade em campo

**Indicador A - participação de horas não faturáveis antes e depois**
- O que mede: percentual das horas apontadas que não são faturáveis.
- Documentado no projeto: nada localizado.
- Falta confirmar: definição de hora não faturável, sistema de origem, períodos antes/depois, número de equipes e semanas.
- Autorização: pendente.
- Classe quando confirmado: resultado medido.

**Indicador B - 10 a 15 horas semanais de capacidade liberada**
- O que mede: horas de trabalho liberadas por semana.
- Falta confirmar: fórmula, premissas, quem foi medido, período, e que a leitura seja de capacidade liberada - não de dinheiro economizado.
- Autorização: pendente.
- Classe quando confirmado: impacto estimado (nunca "resultado medido").

## 3. Cervejaria com diversos pontos de venda - ponto e cálculo de pagamentos

**Indicador A - um dia de fechamento para minutos**
- Falta confirmar: quem executava o fechamento, período anterior de referência, tempo atual, semanas observadas.
- Autorização: pendente.
- Classe quando confirmado: resultado medido.

**Indicador B - unidades atendidas**
- Falta confirmar: número de pontos de venda ativos no sistema e data da verificação.
- Classe quando confirmado: escala de operação.

## 4. Empresa de serviços elétricos - preparação da folha

**Indicador - cerca de seis horas para minutos de revisão**
- Falta confirmar: escopo da tarefa comparada (preparação x revisão), período, responsável, número de ciclos observados.
- Autorização: pendente.
- Classe quando confirmado: resultado medido.

## 5. Instituto de apoio a organizações sociais - triagem para editais

**Indicador - volume e tempo das etapas comparadas**
- Falta confirmar: quantos editais triados, em que período, qual etapa exatamente foi cronometrada antes e depois.
- Autorização: pendente.
- Classe quando confirmado: volume acompanhado e/ou resultado medido, conforme o dado.

## 6. Instituto de apoio a organizações sociais - pesquisa de contatos e prospecção

**Indicador - volume e tempo das etapas comparadas**
- Falta confirmar: contatos pesquisados por período, tempo por contato antes e depois, escopo da revisão humana incluída na medição.
- Autorização: pendente.
- Classe quando confirmado: volume acompanhado.

---

## Regras de ativação

- Capacidade liberada nunca vira economia realizada.
- Saldo identificado nunca vira dinheiro recuperado.
- Capacidade comercial nunca vira venda realizada.
- Recomendação de crédito nunca vira aprovação.
- O mesmo benefício não é somado em dois módulos do mesmo cliente.
- Nada é multiplicado por unidades, funcionários ou semanas sem confirmação de escopo.
