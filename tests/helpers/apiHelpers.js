const request = require('supertest');
const app = require('../../src/app');
const {
  clientPayload,
  professionalPayload,
  servicePayload,
  getFutureDate,
} = require('./testData');

async function registerClient(overrides = {}) {
  const payload = clientPayload(overrides);
  const response = await request(app)
    .post('/api/auth/clients/register')
    .send(payload);

  return { response, payload };
}

async function registerProfessional(overrides = {}) {
  const payload = professionalPayload(overrides);
  const response = await request(app)
    .post('/api/auth/professionals/register')
    .send(payload);

  return { response, payload };
}

async function loginClient(email, password) {
  return request(app)
    .post('/api/auth/clients/login')
    .send({ email, password });
}

async function loginProfessional(email, password) {
  return request(app)
    .post('/api/auth/professionals/login')
    .send({ email, password });
}

async function createService(professionalToken, overrides = {}) {
  return request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${professionalToken}`)
    .send(servicePayload(overrides));
}

async function createAppointment(clientToken, { professionalId, serviceId, date, startTime }) {
  return request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${clientToken}`)
    .send({ professionalId, serviceId, date, startTime });
}

async function setupProfessionalWithService(serviceOverrides = {}) {
  const { response: profReg, payload: profPayload } = await registerProfessional();
  const loginRes = await loginProfessional(profPayload.email, profPayload.password);
  const professionalToken = loginRes.body.token;
  const professionalId = profReg.body.id;

  const serviceRes = await createService(professionalToken, serviceOverrides);
  const serviceId = serviceRes.body.id;

  return {
    professionalToken,
    professionalId,
    serviceId,
    profPayload,
    service: serviceRes.body,
  };
}

async function setupClientWithToken(overrides = {}) {
  const { response: clientReg, payload: clientPayloadData } = await registerClient(overrides);
  const loginRes = await loginClient(clientPayloadData.email, clientPayloadData.password);

  return {
    clientToken: loginRes.body.token,
    clientId: clientReg.body.id,
    clientPayload: clientPayloadData,
  };
}

async function setupFullAppointmentContext(options = {}) {
  const prof = await setupProfessionalWithService(options.serviceOverrides);
  const client = await setupClientWithToken(options.clientOverrides);
  const date = options.date || getFutureDate(7);

  return {
    ...prof,
    ...client,
    date,
  };
}

module.exports = {
  app,
  registerClient,
  registerProfessional,
  loginClient,
  loginProfessional,
  createService,
  createAppointment,
  setupProfessionalWithService,
  setupClientWithToken,
  setupFullAppointmentContext,
  getFutureDate,
};
