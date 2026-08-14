const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { resetDatabase } = require('../helpers/testData');
const {
  setupProfessionalWithService,
  setupClientWithToken,
  createService,
} = require('../helpers/apiHelpers');

describe('Serviços', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /api/services', () => {
    it('CT-009 - deve listar serviços cadastrados', async () => {
      const { professionalToken } = await setupProfessionalWithService();
      await createService(professionalToken, { name: 'Barba', description: 'Barba completa', duration: 20, price: 30 });

      const response = await request(app).get('/api/services');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').with.lengthOf.at.least(1);
      expect(response.body[0]).to.include.keys('id', 'name', 'description', 'duration', 'price', 'createdAt');
    });
  });

  describe('GET /api/services/:id', () => {
    it('CT-010 - deve consultar serviço existente por identificador', async () => {
      const { service } = await setupProfessionalWithService();

      const response = await request(app).get(`/api/services/${service.id}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.include({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
      });
    });

    it('CT-011 - deve indicar que serviço não foi encontrado para identificador inexistente', async () => {
      const inexistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).get(`/api/services/${inexistentId}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
    });
  });

  describe('POST /api/services', () => {
    it('CT-012 - deve cadastrar serviço com profissional autenticado', async () => {
      const { professionalToken } = await setupProfessionalWithService();

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${professionalToken}`)
        .send({
          name: 'Corte premium',
          description: 'Corte com acabamento',
          duration: 45,
          price: 60,
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.include({
        name: 'Corte premium',
        description: 'Corte com acabamento',
        duration: 45,
        price: 60,
      });
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });

    it('CT-013 - deve negar cadastro de serviço por cliente autenticado', async () => {
      const { clientToken } = await setupClientWithToken();

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          name: 'Serviço não autorizado',
          description: 'Tentativa de cadastro por cliente',
          duration: 30,
          price: 40,
        });

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
    });
  });
});
