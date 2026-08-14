const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { resetDatabase, getFutureDate } = require('../helpers/testData');
const {
  setupFullAppointmentContext,
  setupProfessionalWithService,
  setupClientWithToken,
  createAppointment,
} = require('../helpers/apiHelpers');

describe('Disponibilidade', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /api/appointments/available', () => {
    it('CT-014 - deve consultar horários disponíveis com dados válidos', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await request(app)
        .get('/api/appointments/available')
        .query({
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
        })
        .set('Authorization', `Bearer ${ctx.clientToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.include({
        date: ctx.date,
        professionalId: ctx.professionalId,
        serviceId: ctx.serviceId,
        serviceDuration: ctx.service.duration,
      });
      expect(response.body.availableTimes).to.be.an('array').that.is.not.empty;
      expect(response.body.availableTimes[0]).to.include.keys('startTime', 'endTime');
    });

    it('CT-015 - deve responder sem horários disponíveis quando agenda estiver totalmente ocupada', async () => {
      const ctx = await setupFullAppointmentContext();
      const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

      for (const startTime of slots) {
        const client = await setupClientWithToken();
        const res = await createAppointment(client.clientToken, {
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
          startTime,
        });
        expect(res.status).to.equal(201);
      }

      const response = await request(app)
        .get('/api/appointments/available')
        .query({
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
        })
        .set('Authorization', `Bearer ${ctx.clientToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.availableTimes).to.be.an('array').that.is.empty;
    });

    it('CT-016 - deve negar consulta de disponibilidade sem autenticação', async () => {
      const ctx = await setupFullAppointmentContext();

      const response = await request(app)
        .get('/api/appointments/available')
        .query({
          professionalId: ctx.professionalId,
          serviceId: ctx.serviceId,
          date: ctx.date,
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });
});
