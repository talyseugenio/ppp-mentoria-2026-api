# Cenários de Teste

## POST /api/auth/clients/register

### CT-001 — Registrar cliente com dados válidos (Particionamento de Equivalência)
**Dado:** que não exista cliente cadastrado com o e-mail informado e que os dados do cliente sejam válidos.

**Quando:** o cliente enviar a requisição de cadastro.

**Então:** o cliente deve ser criado com sucesso.

### CT-002 — Tentar registrar cliente com e-mail já cadastrado (VADER — Dados)
**Dado:** que já exista um cliente cadastrado com o mesmo e-mail informado.

**Quando:** o cliente tentar registrar novamente com esse e-mail.

**Então:** o cadastro deve ser rejeitado e a duplicidade deve ser evitada.

## POST /api/auth/professionals/register

### CT-003 — Registrar profissional com dados válidos (Particionamento de Equivalência)
**Dado:** que não exista profissional cadastrado com o e-mail informado e que os dados do profissional sejam válidos.

**Quando:** o profissional enviar a requisição de cadastro.

**Então:** o profissional deve ser criado com sucesso.

### CT-004 — Tentar registrar profissional com e-mail já cadastrado (VADER — Dados)
**Dado:** que já exista um profissional cadastrado com o mesmo e-mail informado.

**Quando:** o profissional tentar registrar novamente com esse e-mail.

**Então:** o cadastro deve ser rejeitado e a duplicidade deve ser evitada.

## POST /api/auth/clients/login

### CT-005 — Realizar login de cliente com credenciais válidas (Particionamento de Equivalência)
**Dado:** que exista um cliente cadastrado com as credenciais informadas.

**Quando:** o cliente enviar a solicitação de login.

**Então:** a autenticação deve ser bem-sucedida e o cliente deve receber o token JWT.

### CT-006 — Tentar login de cliente com credenciais inválidas (VADER — Acesso)
**Dado:** que as credenciais informadas não correspondam a um cliente cadastrado.

**Quando:** o cliente tentar autenticar-se.

**Então:** o login deve ser rejeitado e o acesso não deve ser concedido.

## POST /api/auth/professionals/login

### CT-007 — Realizar login de profissional com credenciais válidas (Particionamento de Equivalência)
**Dado:** que exista um profissional cadastrado com as credenciais informadas.

**Quando:** o profissional enviar a solicitação de login.

**Então:** a autenticação deve ser bem-sucedida e o profissional deve receber o token JWT.

### CT-008 — Tentar login de profissional com credenciais inválidas (VADER — Acesso)
**Dado:** que as credenciais informadas não correspondam a um profissional cadastrado.

**Quando:** o profissional tentar autenticar-se.

**Então:** o login deve ser rejeitado e o acesso não deve ser concedido.

## GET /api/services

### CT-009 — Listar serviços cadastrados (Particionamento de Equivalência)
**Dado:** que existam serviços cadastrados na API.

**Quando:** o cliente ou profissional solicitar a listagem de serviços.

**Então:** a API deve retornar a lista de serviços disponíveis.

## GET /api/services/:id

### CT-010 — Consultar serviço existente por identificador (Particionamento de Equivalência)
**Dado:** que exista um serviço cadastrado com o identificador informado.

**Quando:** a requisição for enviada para buscar esse serviço.

**Então:** a API deve retornar os dados do serviço solicitado.

### CT-011 — Consultar serviço com identificador inexistente (VADER — Dados)
**Dado:** que não exista serviço cadastrado com o identificador informado.

**Quando:** a API receber a requisição de busca por esse identificador.

**Então:** o sistema deve indicar que o recurso solicitado não foi encontrado.

## POST /api/services

### CT-012 — Cadastrar serviço com profissional autenticado (Particionamento de Equivalência)
**Dado:** que exista um profissional autenticado e que os dados do serviço sejam válidos.

**Quando:** o profissional solicitar o cadastro do serviço.

**Então:** o serviço deve ser criado com sucesso.

### CT-013 — Tentar cadastrar serviço com cliente autenticado (Tabela de Decisão)
**Dado:** que exista um cliente autenticado.

**Quando:** o cliente tentar cadastrar um serviço.

**Então:** a operação deve ser negada porque apenas profissionais têm permissão para cadastrar serviços.

## GET /api/appointments/available

### CT-014 — Consultar horários disponíveis com dados válidos (Particionamento de Equivalência)
**Dado:** que exista um cliente autenticado, um profissional cadastrado, um serviço cadastrado e uma data válida.

**Quando:** o cliente solicitar a consulta de horários disponíveis.

**Então:** a API deve retornar os horários disponíveis para o profissional e serviço solicitados.

### CT-015 — Consultar horários disponíveis quando não há disponibilidade (Tabela de Decisão)
**Dado:** que não existam horários livres para o profissional, serviço e data informados.

**Quando:** o cliente consultar a disponibilidade.

**Então:** a API deve responder sem horários disponíveis.

### CT-016 — Tentar consultar disponibilidade sem autenticação (VADER — Acesso)
**Dado:** que a requisição seja enviada sem o header de autenticação obrigatório.

**Quando:** o cliente tentar consultar os horários disponíveis.

**Então:** o acesso deve ser negado.

## POST /api/appointments

### CT-017 — Criar agendamento válido com sucesso (Particionamento de Equivalência)
**Dado:** que exista um cliente autenticado, um profissional cadastrado, um serviço cadastrado, uma data futura, um horário dentro do expediente e sem conflito de agenda.

**Quando:** o cliente solicitar a criação do agendamento.

**Então:** o agendamento deve ser criado com sucesso.

### CT-018 — Tentar criar agendamento em data ou horário passados (VADER — Regras)
**Dado:** que o cliente informe uma data ou horário anterior ao momento atual.

**Quando:** o cliente tentar criar o agendamento.

**Então:** a criação deve ser rejeitada, pois não é permitido agendar em datas ou horários passados.

### CT-019 — Tentar criar agendamento fora do horário de funcionamento (Análise de Valor Limite)
**Dado:** que o cliente tente agendar um intervalo que ultrapasse o horário de funcionamento estabelecido entre 09:00 e 18:00.

**Quando:** o cliente solicitar a criação do agendamento.

**Então:** a criação deve ser rejeitada por estar fora do horário de funcionamento.

### CT-020 — Tentar criar agendamento com conflito para o mesmo profissional (Tabela de Decisão)
**Dado:** que já exista um agendamento para o mesmo profissional em um intervalo que conflita com o novo agendamento.

**Quando:** o cliente tentar criar esse agendamento sobreposto.

**Então:** a criação deve ser rejeitada pela regra de não permitir agendamentos em horários já ocupados para o mesmo profissional.

### CT-021 — Tentar criar agendamento com conflito para o mesmo cliente (Tabela de Decisão)
**Dado:** que o cliente já possua um agendamento no mesmo horário solicitado.

**Quando:** o cliente tentar criar outro agendamento sobreposto.

**Então:** a criação deve ser rejeitada pela regra de não permitir que um cliente possua dois agendamentos no mesmo horário.

### CT-022 — Tentar criar agendamento quando a duração do serviço causa sobreposição (Análise de Valor Limite)
**Dado:** que o intervalo do novo agendamento se sobreponha ao de um agendamento existente quando a duração do serviço for considerada.

**Quando:** o cliente tentar criar o agendamento.

**Então:** a criação deve ser rejeitada, pois a duração do serviço deve ser considerada para validar conflitos entre horários.

### CT-023 — Tentar criar agendamento sem autenticação (VADER — Acesso)
**Dado:** que a requisição seja enviada sem token JWT válido.

**Quando:** o cliente tentar criar o agendamento.

**Então:** o acesso deve ser negado.

### CT-024 — Tentar criar agendamento com perfil não autorizado (Tabela de Decisão)
**Dado:** que um profissional autenticado tente criar um agendamento na rota de cliente.

**Quando:** o profissional solicitar a criação do agendamento.

**Então:** a operação deve ser negada porque a criação de agendamento é permitida apenas para clientes.

## GET /api/appointments

### CT-025 — Listar agendamentos do cliente autenticado (Particionamento de Equivalência)
**Dado:** que o usuário autenticado seja um cliente e existam agendamentos associados a esse cliente.

**Quando:** o cliente solicitar a listagem de agendamentos.

**Então:** a API deve retornar apenas os agendamentos do cliente autenticado.

### CT-026 — Listar agendamentos como profissional autenticado (Particionamento de Equivalência)
**Dado:** que o usuário autenticado seja um profissional e existam agendamentos cadastrados no sistema.

**Quando:** o profissional solicitar a listagem de agendamentos.

**Então:** a API deve retornar todos os agendamentos do sistema.

## GET /api/appointments/:id

### CT-027 — Consultar agendamento próprio do cliente autenticado (Particionamento de Equivalência)
**Dado:** que exista um agendamento pertencente ao cliente autenticado e o identificador informado seja válido.

**Quando:** o cliente solicitar a consulta desse agendamento.

**Então:** a API deve retornar os dados do agendamento solicitado.

### CT-028 — Tentar consultar agendamento de outro cliente (VADER — Acesso)
**Dado:** que exista um agendamento pertencente a outro cliente.

**Quando:** o cliente autenticado tentar consultar esse agendamento.

**Então:** o acesso deve ser negado e o cliente não deve visualizar agendamentos de terceiros.

### CT-029 — Consultar agendamento por profissional autenticado (Particionamento de Equivalência)
**Dado:** que o usuário autenticado seja um profissional e exista um agendamento válido no sistema.

**Quando:** o profissional solicitar a consulta desse agendamento.

**Então:** a API deve retornar os dados do agendamento solicitado.

## PATCH /api/appointments/:id/cancel

### CT-030 — Cancelar agendamento próprio do cliente com sucesso (Particionamento de Equivalência)
**Dado:** que exista um agendamento pertencente ao cliente autenticado.

**Quando:** o cliente solicitar o cancelamento desse agendamento.

**Então:** o agendamento deve ser cancelado com sucesso.

### CT-031 — Tentar cancelar agendamento de outro cliente (VADER — Acesso)
**Dado:** que exista um agendamento pertencente a outro cliente.

**Quando:** o cliente autenticado tentar cancelar esse agendamento.

**Então:** a operação deve ser negada, pois clientes só podem cancelar seus próprios agendamentos.

## PATCH /api/appointments/:id/complete

### CT-032 — Concluir atendimento do profissional responsável com sucesso (Particionamento de Equivalência)
**Dado:** que exista um agendamento válido e o profissional autenticado seja o responsável por esse agendamento.

**Quando:** o profissional solicitar a conclusão do atendimento.

**Então:** o agendamento deve ser concluído com sucesso.

### CT-033 — Tentar concluir atendimento de outro profissional (VADER — Acesso)
**Dado:** que exista um agendamento cujo responsável seja outro profissional.

**Quando:** o profissional autenticado tentar concluir esse atendimento.

**Então:** a operação deve ser negada, pois apenas o profissional responsável pode concluir o atendimento.

# Cobertura

- Quantidade total de cenários: 33
- Quantidade por endpoint:
  - POST /api/auth/clients/register: 2
  - POST /api/auth/professionals/register: 2
  - POST /api/auth/clients/login: 2
  - POST /api/auth/professionals/login: 2
  - GET /api/services: 1
  - GET /api/services/:id: 2
  - POST /api/services: 2
  - GET /api/appointments/available: 3
  - POST /api/appointments: 8
  - GET /api/appointments: 2
  - GET /api/appointments/:id: 3
  - PATCH /api/appointments/:id/cancel: 2
  - PATCH /api/appointments/:id/complete: 2
- Técnicas utilizadas:
  - Particionamento de Equivalência
  - Tabela de Decisão
  - Análise de Valor Limite
  - VADER
- Principais riscos cobertos:
  - autenticação e autorização por perfil;
  - acesso a recursos de terceiros;
  - conflitos de horário;
  - sobreposição considerando duração do serviço;
  - agendamento em data ou horário passado;
  - limite do horário de funcionamento;
  - dependência entre autenticação, serviços e agendamentos;
  - integridade do fluxo de criação, consulta, cancelamento e conclusão.

# Lacunas Identificadas

- A documentação não especifica os códigos HTTP exatos para sucesso ou falha em cada endpoint.
- A documentação não detalha mensagens de erro para validação, autenticação, autorização, duplicidade ou recurso inexistente.
- Não há definição explícita de campos obrigatórios, formatos de e-mail, senha, telefone e demais validações de entrada.
- Não há regra documentada sobre mínimos e máximos para campos como nome, telefone, descrição, preço, duração e demais atributos.
- Não há comportamento descrito para identificadores inválidos, ID inexistente, payload incompleto ou dados nulos.
- A documentação informa apenas que o token expira em 24 horas, mas não detalha o comportamento exato quando expira em cenários de autenticação e autorização.
- Não há regra documentada para estados adicionais de agendamento além do cancelamento e da conclusão.
- Não há definição explícita para operação repetida, como cancelar um agendamento já cancelado ou concluir um agendamento já concluído.
- Não há requisito documentado sobre paginação, ordenação, filtros, busca avançada ou paginação de listagens.
- Não há regra explícita para tratamento de erros internos, falhas de persistência ou comportamento em cenários de concorrência.

# Inconsistências Identificadas

Nenhuma inconsistência direta foi identificada entre as regras explicitamente documentadas. O que existe é principalmente uma série de ambiguidades e ausências de especificação, que impactam a definição de testes mais precisos, mas não configuram conflito entre requisitos documentados.
