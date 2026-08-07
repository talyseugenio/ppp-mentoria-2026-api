const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../database/memory');
const { createClient, toPublicClient } = require('../models/Client');
const { createProfessional, toPublicProfessional } = require('../models/Professional');
const { validateRequiredFields } = require('../utils/time');

function generateToken(user, role) {
  return jwt.sign(
    { id: user.id, email: user.email, role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

function registerClient(data) {
  validateRequiredFields(data, ['name', 'email', 'password', 'phone']);

  const existing = db.clients.find((c) => c.email === data.email);
  if (existing) {
    const error = new Error('E-mail já cadastrado');
    error.statusCode = 409;
    throw error;
  }

  const client = createClient(data);
  db.clients.push(client);
  return toPublicClient(client);
}

function registerProfessional(data) {
  validateRequiredFields(data, ['name', 'email', 'password', 'phone', 'specialty']);

  const existing = db.professionals.find((p) => p.email === data.email);
  if (existing) {
    const error = new Error('E-mail já cadastrado');
    error.statusCode = 409;
    throw error;
  }

  const professional = createProfessional(data);
  db.professionals.push(professional);
  return toPublicProfessional(professional);
}

function loginClient({ email, password }) {
  validateRequiredFields({ email, password }, ['email', 'password']);

  const client = db.clients.find((c) => c.email === email);
  if (!client || !bcrypt.compareSync(password, client.password)) {
    const error = new Error('E-mail ou senha inválidos');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(client, 'client');
  return { token, client: toPublicClient(client) };
}

function loginProfessional({ email, password }) {
  validateRequiredFields({ email, password }, ['email', 'password']);

  const professional = db.professionals.find((p) => p.email === email);
  if (!professional || !bcrypt.compareSync(password, professional.password)) {
    const error = new Error('E-mail ou senha inválidos');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(professional, 'professional');
  return { token, professional: toPublicProfessional(professional) };
}

module.exports = {
  registerClient,
  registerProfessional,
  loginClient,
  loginProfessional,
};
