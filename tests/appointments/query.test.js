const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { resetDatabase, getFutureDate } = require('../helpers/testData');
const {
  setupFullAppointmentContext,
  setupClientWithToken,
  setupProfessionalWithService,
  createAppointment,
} = require('../helpers/apiHelpers');

describe('Agendamentos - Consultas', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /api/appointments', () => {
    it('CT-025 - deve listar apenas agendamentos do cliente autenticado', async () => {
      const clientA = await setupClientWithToken();
      const clientB = await setupClientWithToken();
      const prof = await setupProfessionalWithService();
      const date = getFutureDate(7);

      await createAppointment(clientA.clientToken, {
        professionalId: prof.professionalId,
        serviceId: prof.serviceId,
        date,
        startTime: '09:00',
      });

      await createAppointment(clientB.clientToken, {
        professionalId: prof.professionalId,
        serviceId: prof.serviceId,
        date,
        startTime: '09:30',
      });

      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${clientA.clientToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').with.lengthOf(1);
      expect(response.body[0].clientId).to.equal(clientA.clientId);
    });

    it('CT-026 - deve listar todos os agendamentos como profissional autenticado', async () => {
      const clientA = await setupClientWithToken();
      const clientB = await setupClientWithToken();
      const prof = await setupProfessionalWithService();
      const date = getFutureDate(7);

      await createAppointment(clientA.clientToken, {
        professionalId: prof.professionalId,
        serviceId: prof.serviceId,
        date,
        startTime: '09:00',
      });

      await createAppointment(clientB.clientToken, {
        professionalId: prof.professionalId,
        serviceId: prof.serviceId,
        date,
        startTime: '09:30',
      });

      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${prof.professionalToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').with.lengthOf(2);
    });
  });

  describe('GET /api/appointments/:id', () => {
    it('CT-027 - deve consultar agendamento próprio do cliente autenticado', async () => {
      const ctx = await setupFullAppointmentContext();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .get(`/api/appointments/${created.body.id}`)
        .set('Authorization', `Bearer ${ctx.clientToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(created.body.id);
      expect(response.body.clientId).to.equal(ctx.clientId);
    });

    it('CT-028 - deve negar consulta de agendamento de outro cliente', async () => {
      const ctx = await setupFullAppointmentContext();
      const otherClient = await setupClientWithToken();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .get(`/api/appointments/${created.body.id}`)
        .set('Authorization', `Bearer ${otherClient.clientToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
    });

    it('CT-029 - deve consultar agendamento por profissional autenticado', async () => {
      const ctx = await setupFullAppointmentContext();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .get(`/api/appointments/${created.body.id}`)
        .set('Authorization', `Bearer ${ctx.professionalToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(created.body.id);
    });
  });
});
