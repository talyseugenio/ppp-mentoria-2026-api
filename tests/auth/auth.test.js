const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { resetDatabase, clientPayload, professionalPayload } = require('../helpers/testData');
const { registerClient, registerProfessional } = require('../helpers/apiHelpers');

describe('Autenticação', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('POST /api/auth/clients/register', () => {
    it('CT-001 - deve registrar cliente com dados válidos', async () => {
      const payload = clientPayload();

      const response = await request(app)
        .post('/api/auth/clients/register')
        .send(payload);

      // Status HTTP conforme swagger.yaml (resources/swagger.yaml)
      expect(response.status).to.equal(201);
      expect(response.body).to.include({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.not.have.property('password');
    });

    it('CT-002 - deve rejeitar registro de cliente com e-mail já cadastrado', async () => {
      const payload = clientPayload();

      await request(app)
        .post('/api/auth/clients/register')
        .send(payload);

      const response = await request(app)
        .post('/api/auth/clients/register')
        .send(payload);

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/auth/professionals/register', () => {
    it('CT-003 - deve registrar profissional com dados válidos', async () => {
      const payload = professionalPayload();

      const response = await request(app)
        .post('/api/auth/professionals/register')
        .send(payload);

      expect(response.status).to.equal(201);
      expect(response.body).to.include({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        specialty: payload.specialty,
      });
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.not.have.property('password');
    });

    it('CT-004 - deve rejeitar registro de profissional com e-mail já cadastrado', async () => {
      const payload = professionalPayload();

      await request(app)
        .post('/api/auth/professionals/register')
        .send(payload);

      const response = await request(app)
        .post('/api/auth/professionals/register')
        .send(payload);

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/auth/clients/login', () => {
    it('CT-005 - deve realizar login de cliente com credenciais válidas', async () => {
      const { payload } = await registerClient();

      const response = await request(app)
        .post('/api/auth/clients/login')
        .send({ email: payload.email, password: payload.password });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
      expect(response.body).to.have.property('client');
      expect(response.body.client).to.include({
        email: payload.email,
        name: payload.name,
      });
    });

    it('CT-006 - deve rejeitar login de cliente com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/clients/login')
        .send({ email: 'inexistente@test.com', password: 'senhaerrada' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body).to.not.have.property('token');
    });
  });

  describe('POST /api/auth/professionals/login', () => {
    it('CT-007 - deve realizar login de profissional com credenciais válidas', async () => {
      const { payload } = await registerProfessional();

      const response = await request(app)
        .post('/api/auth/professionals/login')
        .send({ email: payload.email, password: payload.password });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
      expect(response.body).to.have.property('professional');
      expect(response.body.professional).to.include({
        email: payload.email,
        name: payload.name,
      });
    });

    it('CT-008 - deve rejeitar login de profissional com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/professionals/login')
        .send({ email: 'inexistente@test.com', password: 'senhaerrada' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body).to.not.have.property('token');
    });
  });
});
