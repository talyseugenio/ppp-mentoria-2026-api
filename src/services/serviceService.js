const db = require('../database/memory');
const { createService } = require('../models/Service');
const { validateRequiredFields } = require('../utils/time');

function create(data) {
  validateRequiredFields(data, ['name', 'description', 'duration', 'price']);

  if (typeof data.duration !== 'number' || data.duration <= 0) {
    const error = new Error('A duração deve ser um número positivo em minutos');
    error.statusCode = 400;
    throw error;
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    const error = new Error('O preço deve ser um número positivo');
    error.statusCode = 400;
    throw error;
  }

  const service = createService(data);
  db.services.push(service);
  return service;
}

function findAll() {
  return db.services;
}

function findById(id) {
  const service = db.services.find((s) => s.id === id);
  if (!service) {
    const error = new Error('Serviço não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return service;
}

module.exports = { create, findAll, findById };
