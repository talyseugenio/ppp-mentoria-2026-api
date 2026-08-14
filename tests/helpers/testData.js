const db = require('../../src/database/memory');

function resetDatabase() {
  db.clients.length = 0;
  db.professionals.length = 0;
  db.services.length = 0;
  db.appointments.length = 0;
}

function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;
}

function getFutureDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

function clientPayload(overrides = {}) {
  return {
    name: 'Cliente Teste',
    email: uniqueEmail('cliente'),
    password: 'senha123',
    phone: '11999999999',
    ...overrides,
  };
}

function professionalPayload(overrides = {}) {
  return {
    name: 'Profissional Teste',
    email: uniqueEmail('profissional'),
    password: 'senha123',
    phone: '11988888888',
    specialty: 'Corte masculino',
    ...overrides,
  };
}

function servicePayload(overrides = {}) {
  return {
    name: 'Corte de cabelo',
    description: 'Corte masculino tradicional',
    duration: 30,
    price: 45,
    ...overrides,
  };
}

module.exports = {
  resetDatabase,
  uniqueEmail,
  getFutureDate,
  clientPayload,
  professionalPayload,
  servicePayload,
};
