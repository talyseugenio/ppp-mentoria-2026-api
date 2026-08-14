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

describe('Agendamentos - Ciclo de vida', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('PATCH /api/appointments/:id/cancel', () => {
    it('CT-030 - deve cancelar agendamento próprio do cliente com sucesso', async () => {
      const ctx = await setupFullAppointmentContext();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .patch(`/api/appointments/${created.body.id}/cancel`)
        .set('Authorization', `Bearer ${ctx.clientToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('cancelled');
      expect(response.body.id).to.equal(created.body.id);
    });

    it('CT-031 - deve negar cancelamento de agendamento de outro cliente', async () => {
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
        .patch(`/api/appointments/${created.body.id}/cancel`)
        .set('Authorization', `Bearer ${otherClient.clientToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
    });
  });

  describe('PATCH /api/appointments/:id/complete', () => {
    it('CT-032 - deve concluir atendimento do profissional responsável com sucesso', async () => {
      const ctx = await setupFullAppointmentContext();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .patch(`/api/appointments/${created.body.id}/complete`)
        .set('Authorization', `Bearer ${ctx.professionalToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('completed');
      expect(response.body.id).to.equal(created.body.id);
    });

    it('CT-033 - deve negar conclusão de atendimento por outro profissional', async () => {
      const ctx = await setupFullAppointmentContext();
      const otherProfessional = await setupProfessionalWithService();

      const created = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(created.status).to.equal(201);

      const response = await request(app)
        .patch(`/api/appointments/${created.body.id}/complete`)
        .set('Authorization', `Bearer ${otherProfessional.professionalToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
    });
  });
});
