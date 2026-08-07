# API de Agendamentos - Barbearia

API REST para gerenciamento de agendamentos de uma barbearia, desenvolvida com Node.js e Express.

## Funcionalidades

- Registro e autenticação de clientes e profissionais (JWT)
- Cadastro e consulta de serviços
- Consulta de horários disponíveis
- Criação, listagem, cancelamento e conclusão de agendamentos
- Autorização baseada em perfil (Cliente e Profissional)
- Validação de conflitos de horário considerando a duração do serviço

## Tecnologias

- **Node.js**
- **Express** — framework web
- **JSON Web Token (JWT)** — autenticação
- **bcryptjs** — hash de senhas
- **Swagger UI** — documentação interativa da API
- **Banco de dados em memória** — armazenamento temporário dos dados

## Estrutura do Projeto

```
src/
├── config/          # Configurações da aplicação
├── controllers/     # Camada de controle (requisições/respostas)
├── database/        # Banco de dados em memória
├── middleware/      # Middlewares (autenticação e autorização)
├── models/          # Modelos de dados
├── routes/          # Definição das rotas
├── services/        # Regras de negócio
├── utils/           # Utilitários (validação de horários)
├── app.js           # Configuração do Express
└── server.js        # Ponto de entrada da aplicação
resources/
└── swagger.yaml     # Documentação OpenAPI/Swagger
```

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Executando a API

```bash
# Modo produção
npm start

# Modo desenvolvimento (com hot reload)
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

## Endpoints

### Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/api/auth/clients/register` | Registrar cliente | Não |
| POST | `/api/auth/professionals/register` | Registrar profissional | Não |
| POST | `/api/auth/clients/login` | Login de cliente | Não |
| POST | `/api/auth/professionals/login` | Login de profissional | Não |

### Serviços

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/api/services` | Listar serviços | Não |
| GET | `/api/services/:id` | Buscar serviço | Não |
| POST | `/api/services` | Cadastrar serviço | Profissional |

### Agendamentos

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/api/appointments/available` | Horários disponíveis | Sim |
| POST | `/api/appointments` | Criar agendamento | Cliente |
| GET | `/api/appointments` | Listar agendamentos | Sim |
| GET | `/api/appointments/:id` | Buscar agendamento | Sim |
| PATCH | `/api/appointments/:id/cancel` | Cancelar agendamento | Cliente |
| PATCH | `/api/appointments/:id/complete` | Concluir atendimento | Profissional |

## Regras de Negócio

- Horário de funcionamento: **09:00 às 18:00**
- Não é permitido agendar em datas ou horários passados
- Não é permitido agendamentos em horários já ocupados para o mesmo profissional
- Não é permitido que um cliente possua dois agendamentos no mesmo horário
- A duração do serviço é considerada para validar conflitos entre horários
- Clientes visualizam e cancelam apenas seus próprios agendamentos
- Profissionais visualizam todos os agendamentos e podem concluir atendimentos
- Apenas o profissional responsável pode concluir um atendimento

## Autenticação

Endpoints protegidos exigem o header:

```
Authorization: Bearer <token>
```

O token JWT é obtido nos endpoints de login e expira em 24 horas.

## Exemplo de Uso

```bash
# 1. Registrar um profissional
curl -X POST http://localhost:3000/api/auth/professionals/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos","email":"carlos@barbearia.com","password":"123456","phone":"11988888888","specialty":"Corte"}'

# 2. Login do profissional
curl -X POST http://localhost:3000/api/auth/professionals/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos@barbearia.com","password":"123456"}'

# 3. Cadastrar serviço (usar token do profissional)
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Corte de cabelo","description":"Corte masculino","duration":30,"price":45.00}'

# 4. Registrar e logar cliente
curl -X POST http://localhost:3000/api/auth/clients/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"123456","phone":"11999999999"}'

curl -X POST http://localhost:3000/api/auth/clients/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

# 5. Consultar horários disponíveis
curl "http://localhost:3000/api/appointments/available?professionalId=<id>&serviceId=<id>&date=2026-08-10" \
  -H "Authorization: Bearer <token_cliente>"

# 6. Criar agendamento
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_cliente>" \
  -d '{"professionalId":"<id>","serviceId":"<id>","date":"2026-08-10","startTime":"09:00"}'
```

## Licença

MIT
