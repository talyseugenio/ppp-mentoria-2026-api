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

describe('Agendamentos - Criação', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('POST /api/appointments', () => {
    it('CT-017 - deve criar agendamento válido com sucesso', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });

      expect(response.status).to.equal(201);
      expect(response.body).to.include({
        clientId: ctx.clientId,
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
        endTime: '09:30',
        status: 'scheduled',
      });
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('client');
      expect(response.body).to.have.property('professional');
      expect(response.body).to.have.property('service');
    });

    it('CT-018 - deve rejeitar agendamento em data ou horário passados', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: '2020-01-01',
        startTime: '09:00',
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('CT-019 - deve rejeitar agendamento fora do horário de funcionamento (09:00 - 18:00)', async () => {
      const ctx = await setupFullAppointmentContext({ serviceOverrides: { duration: 60 } });

      const response = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '17:30',
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('CT-020 - deve rejeitar agendamento com conflito para o mesmo profissional', async () => {
      const ctx = await setupFullAppointmentContext();
      const otherClient = await setupClientWithToken();

      const first = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(first.status).to.equal(201);

      const response = await createAppointment(otherClient.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error');
    });

    it('CT-021 - deve rejeitar agendamento com conflito para o mesmo cliente no mesmo horário', async () => {
      const prof1 = await setupProfessionalWithService();
      const prof2 = await setupProfessionalWithService();
      const client = await setupClientWithToken();
      const date = getFutureDate(7);

      const first = await createAppointment(client.clientToken, {
        professionalId: prof1.professionalId,
        serviceId: prof1.serviceId,
        date,
        startTime: '10:00',
      });
      expect(first.status).to.equal(201);

      const response = await createAppointment(client.clientToken, {
        professionalId: prof2.professionalId,
        serviceId: prof2.serviceId,
        date,
        startTime: '10:00',
      });

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error');
    });

    it('CT-022 - deve rejeitar agendamento quando a duração do serviço causa sobreposição', async () => {
      const ctx = await setupFullAppointmentContext();

      const first = await createAppointment(ctx.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:00',
      });
      expect(first.status).to.equal(201);

      const otherClient = await setupClientWithToken();
      const response = await createAppointment(otherClient.clientToken, {
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        date: ctx.date,
        startTime: '09:15',
      });

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error');
    });

    it('CT-023 - deve negar criação de agendamento sem autenticação', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await request(app)
        .post('/api/appointments')
        .send({
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
          startTime: '09:00',
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });

    it('CT-024 - deve negar criação de agendamento por profissional autenticado', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${ctx.professionalToken}`)
        .send({
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
          startTime: '09:00',
        });

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
    });
  });
});
