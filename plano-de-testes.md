# Plano de Testes

## 1. Objetivo do Plano

Este plano tem como objetivo organizar a estratégia de validação da API de agendamentos da barbearia, com base na documentação do projeto, nas regras de negócio documentadas e nos cenários de teste existentes. A execução será orientada por risco, dependência funcional e cobertura dos fluxos críticos da aplicação.

O plano busca verificar:

- funcionamento dos principais fluxos da API;
- aderência às regras de negócio documentadas;
- comportamento em cenários válidos e inválidos;
- autenticação e autorização;
- integração entre clientes, profissionais, serviços e agendamentos;
- disponibilidade e conflitos de horários;
- ciclo de vida dos agendamentos;
- riscos relevantes do sistema;
- pontos que exigem esclarecimento por falta de especificação.

## 2. Escopo

### 2.1 Dentro do escopo

- testes funcionais;
- testes de API;
- testes de integração;
- testes de autenticação;
- testes de autorização;
- testes exploratórios;
- validação das regras de negócio documentadas;
- execução dos fluxos cobertos pelos cenários existentes.

### 2.2 Fora do escopo

- testes de frontend;
- testes visuais;
- testes de interface;
- testes de infraestrutura sem relação direta com a API;
- testes de sistemas externos não documentados;
- requisitos não presentes na documentação.

## 3. Base de Teste

A base deste plano será:

- documentação da API;
- regras de negócio documentadas;
- cenários de teste existentes;
- riscos identificados;
- lacunas e ambiguidades da documentação.

Os cenários existentes serão reaproveitados como principal base funcional do plano. Eles não serão recriados, reescritos, renumerados ou alterados. A função do plano é organizar a execução, a prioridade, a rastreabilidade e a avaliação desses cenários no contexto do projeto.

## 4. Tipos de Teste

### 4.1 Testes Funcionais

Os testes funcionais serão executados com base nos cenários existentes e terão como foco validar os comportamentos esperados da API nos principais fluxos do negócio.

Eles serão usados para validar:

- cadastro de clientes e profissionais;
- autenticação de clientes e profissionais;
- consulta e cadastro de serviços;
- disponibilidade de horários;
- criação, consulta, cancelamento e conclusão de agendamentos;
- autorização por perfil;
- regras do fluxo de negócio.

Esses cenários já representam a principal estratégia funcional do projeto e devem ser utilizados como referência durante a execução.

### 4.2 Testes de API

Os testes de API avaliarão diretamente as requisições e respostas da aplicação, considerando:

- método HTTP;
- endpoint;
- headers;
- autenticação;
- parâmetros;
- payload;
- resposta;
- comportamento esperado.

A validação deve respeitar somente o que está documentado. Quando um código HTTP ou mensagem esperada não estiver previamente definido, esse ponto será tratado como lacuna de especificação.

### 4.3 Testes de Integração

Os testes de integração serão focados no comportamento dos fluxos quando diferentes recursos da API interagem entre si.

Os principais fluxos de integração a serem verificados são:

- autenticação → autorização;
- profissional → serviço;
- serviço → disponibilidade;
- disponibilidade → agendamento;
- cliente → agendamento;
- agendamento → cancelamento;
- agendamento → conclusão.

O objetivo é verificar se a API funciona de forma consistente em fluxo real, e não apenas em cenário isolado de endpoint.

### 4.4 Testes de Autenticação e Autorização

Este é um ponto crítico do projeto, dada a presença de JWT e perfis distintos. Os testes de autenticação e autorização devem validar:

- login válido;
- login inválido;
- acesso sem autenticação;
- uso do token JWT;
- autorização por perfil;
- acesso indevido;
- acesso a recursos de terceiros;
- propriedade do agendamento;
- responsabilidade do profissional sobre o atendimento.

Não serão inventadas regras adicionais de permissão que não existam na documentação.

### 4.5 Testes Exploratórios

Os testes exploratórios serão usados para investigar:

- lacunas de especificação;
- ambiguidades na documentação;
- combinações de dados;
- sequências de operações;
- repetição de operações;
- limites documentados;
- estados não totalmente definidos;
- riscos que não estão completamente cobertos pelos cenários existentes.

Esses testes não criam requisito. Se um comportamento não estiver documentado, ele deve ser registrado como:

> Lacuna de especificação / comportamento a esclarecer.

## 5. Estratégia de Execução

A execução será organizada em uma ordem lógica, considerando dependências entre funcionalidades, autenticação, autorização e regras de negócio.

1. preparação do ambiente;
2. cadastro;
3. autenticação;
4. autorização;
5. serviços;
6. disponibilidade;
7. criação de agendamentos;
8. consulta de agendamentos;
9. cancelamento;
10. conclusão;
11. integração;
12. testes exploratórios;
13. regressão.

Essa ordem faz sentido porque a API depende de pré-condições básicas, como cadastro e autenticação, antes de validar serviços, disponibilidade e agendamentos. Isso reduz ruído na execução e mantém a análise focada nos fluxos críticos.

## 6. Técnicas de Teste

As técnicas a serem aplicadas serão as mesmas já empregadas no conjunto de cenários existentes:

- Particionamento de Equivalência;
- Análise de Valor Limite;
- Tabela de Decisão;
- VADER.

### 6.1 Particionamento de Equivalência

Será utilizado para agrupar comportamentos semelhantes, como:

- usuário autenticado e não autenticado;
- recurso existente e inexistente;
- fluxo válido e inválido;
- disponibilidade disponível e indisponível.

### 6.2 Análise de Valor Limite

Será aplicada em regras temporais e de limite, por exemplo:

- horário de funcionamento;
- datas passadas e futuras;
- sobreposição de intervalos;
- duração do serviço na validação de conflito.

### 6.3 Tabela de Decisão

Aplicada quando o resultado depende da combinação de condições, por exemplo:

- perfil + recurso + operação;
- profissional + horário + conflito;
- cliente + agendamento + autorização.

### 6.4 VADER

Aplicada em situações que envolvem validação, acesso, dados, estado e regras relacionadas a tempo, como:

- credenciais inválidas;
- acesso indevido;
- duplicidade;
- conflito de horários;
- estados do agendamento.

Essas técnicas devem ser usadas conforme o risco e a regra em questão, não como checklist obrigatório para todos os cenários.

## 7. Riscos e Prioridades

| Risco | Impacto | Prioridade | Estratégia de teste |
|---|---|---|---|
| Autenticação e acesso sem token | Uso indevido da API | Alta | Validar login, token e acesso protegido |
| Autorização por perfil | Acesso indevido a recursos | Alta | Validar cliente x profissional e propriedade do recurso |
| Conflitos de horários para o mesmo profissional | Agendamentos inválidos | Alta | Validar disponibilidade e conflitos |
| Duração do serviço | Sobreposição e conflito de agenda | Alta | Validar cálculo de conflito pela duração |
| Agendamento em data ou horário passado | Violação da regra de negócio | Alta | Validar datas e horários futuros |
| Horário de funcionamento | Agendamento fora do período permitido | Alta | Validar regra de 09:00 às 18:00 |
| Ciclo de vida do agendamento | Cancelamento e conclusão inadequados | Alta | Validar propriedade e autorização |
| Disponibilidade | Falha na percepção de horários disponíveis | Média | Validar disponibilidade e regras de ocupação |
| Serviços | Cadastro indevido ou uso incorreto | Média | Validar autorização na criação |
| Consultas de agendamentos | Exposição indevida de dados | Média | Validar acesso por proprietário |
| Lacunas e ambiguidades | Dificuldade de definição do comportamento esperado | Baixa | Registrar como lacuna de especificação |

## 8. Ambiente de Testes

A seção de ambiente deve refletir apenas as informações disponíveis do projeto e da documentação.

### Itens a considerar

- ambiente de testes da API;
- URL/base URL;
- configuração da API;
- endpoints documentados;
- autenticação por JWT;
- isolamento de dados;
- recursos e dependências necessárias para execução.

Se algum detalhe do ambiente não estiver documentado, deve ser registrado como:

> Não especificado na documentação.

## 9. Configuração da API

Para executar os testes, é necessário que a API esteja preparada para:

- receber requisições aos endpoints documentados;
- permitir cadastro de clientes e profissionais;
- permitir login e geração de JWT;
- exigir autenticação em endpoints protegidos;
- receber payloads de serviço e agendamento;
- permitir consulta de disponibilidade;
- permitir criação, consulta, cancelamento e conclusão de agendamentos;
- permitir uso de headers e autenticação conforme a documentação.

Não serão inventadas configurações técnicas que não estejam documentadas.

## 10. Massa de Dados

A massa de dados deverá incluir os tipos de dados necessários para validar os fluxos da API.

### Dados necessários

- clientes;
- profissionais;
- credenciais válidas;
- credenciais inválidas;
- serviços;
- agendamentos;
- horários disponíveis;
- horários ocupados;
- conflitos de agenda;
- usuários distintos para validação de autorização;
- profissionais distintos para validação de responsabilidade.

Não serão inventados valores específicos de e-mail, senha, telefone, nome, preço ou ID, porque isso não foi definido como requisito. O plano deve indicar apenas a finalidade da massa de dados.

## 11. Critérios de Entrada

A execução dos testes deve começar somente quando estiverem disponíveis:

- API disponível;
- ambiente preparado;
- endpoints acessíveis;
- dados necessários disponíveis;
- autenticação funcionando;
- cenários a serem executados definidos;
- riscos priorizados;
- acesso às permissões necessárias.

## 12. Critérios de Saída

A execução pode ser considerada concluída quando:

- os cenários prioritários forem executados;
- os fluxos críticos forem avaliados;
- autenticação e autorização forem validadas;
- regras de negócio críticas forem verificadas;
- defeitos relevantes forem registrados;
- regressão necessária tiver sido executada;
- resultados tiverem sido documentados.

## 13. Critérios de Aprovação e Reprovação

### Aprovação

Um teste será aprovado quando o comportamento observado estiver em conformidade com as regras e expectativas documentadas.

### Reprovação

Um teste será reprovado quando houver divergência entre o comportamento observado e o comportamento esperado, ou quando uma regra documentada for violada.

Se o comportamento esperado não estiver definido na documentação, não será classificado automaticamente como defeito. Nesse caso, o correto é registrar:

> Lacuna de especificação / comportamento a esclarecer.

## 14. Registro de Defeitos

A estratégia de registro de bugs deve ser simples e suficiente para permitir reprodução, análise e correção.

### Informações mínimas

- título;
- endpoint;
- método HTTP;
- ambiente;
- pré-condições;
- passos;
- resultado esperado;
- resultado obtido;
- evidência;
- severidade;
- prioridade;
- observações relevantes.

Esse nível de detalhamento é suficiente para manter rastreabilidade sem criar processo excessivamente burocrático.

## 15. Regressão

A regressão deve ser orientada pelo impacto da correção e pelo risco do fluxo afetado.

### Estratégia de regressão

- reexecutar os testes diretamente relacionados à correção;
- validar fluxos integrados afetados;
- priorizar riscos altos;
- reaproveitar os cenários existentes;
- não criar uma segunda suíte paralela de regressão;
- executar regressão completa apenas quando o impacto justificar.

## 16. Entregáveis

Os entregáveis do processo de testes serão:

- Plano de Testes;
- cenários de teste existentes;
- evidências de execução;
- registros de defeitos;
- resultado da execução;
- relatório/conclusão do ciclo de testes.

## 17. Lacunas de Especificação

A documentação apresenta algumas lacunas relevantes que impactam a definição dos testes. Elas precisam ser registradas como lacuna e não como requisito.

### Lacunas relevantes

- códigos HTTP não especificados;
- mensagens de erro não especificadas;
- validação de campos não detalhada;
- formatos de dados não documentados;
- IDs inválidos e inexistentes sem comportamento detalhado;
- payloads incompletos sem regra explícita;
- expiração do JWT não detalhada;
- estados de agendamento não plenamente definidos;
- operações repetidas sem regra documentada;
- paginação, filtros e ordenação não especificados;
- erros internos e persistência não detalhados;
- concorrência não definida.

> Lacuna de especificação não deve ser transformada automaticamente em requisito ou em defeito.

## 18. Inconsistências

Até o momento, não foram identificadas inconsistências diretas entre as informações analisadas. Eventuais conflitos encontrados durante a execução ou revisão dos cenários deverão ser registrados nesta seção.

## 19. Rastreabilidade

| Área | Cenários | Tipo de teste |
|---|---|---|
| Autenticação | CT-001 a CT-008 | Funcional, API, autenticação |
| Serviços | CT-009 a CT-013 | Funcional, API, autorização |
| Disponibilidade | CT-014 a CT-016 | Funcional, API, regras de negócio |
| Agendamentos | CT-017 a CT-024 | Funcional, integração, regras de negócio |
| Consultas | CT-025 a CT-029 | Funcional, API, autorização |
| Ciclo de vida | CT-030 a CT-033 | Funcional, integração, autorização |

A tabela demonstra como os cenários existentes serão reutilizados como base funcional e de rastreabilidade do plano, sem recriação de nova suíte.

## 20. Cobertura da Estratégia

A estratégia de teste contempla os principais aspectos do projeto:

- funcionalidade principal;
- regras de negócio;
- riscos críticos;
- autenticação;
- autorização;
- integração;
- exploração;
- regressão;
- dados;
- ambiente;
- lacunas.

O plano não pretende reinventar requisitos nem criar novas regras de negócio. O objetivo é organizar e orientar a execução dos testes que já existem, além de registrar os pontos que continuam sem definição clara na documentação.

## 21. Conclusão

Este Plano de Testes foi estruturado para validar a API de agendamentos da barbearia com foco em risco, regras de negócio e execução prática. A estratégia usa os cenários existentes como base funcional e organiza a execução em uma sequência lógica, priorizando autenticação, autorização, disponibilidade, conflitos de horários, duração do serviço e ciclo de vida dos agendamentos.

Os principais riscos estão ligados a acesso indevido, conflito de agenda, agendamento em data ou horário passado, validade do horário de funcionamento e integridade do fluxo de criação, consulta, cancelamento e conclusão de agendamentos. O plano também deixa claro que algumas partes da documentação não estão totalmente especificadas, e esses pontos devem ser tratados como lacuna de especificação e não como requisito inventado.
