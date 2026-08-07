const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

function createProfessional({ name, email, password, phone, specialty }) {
  return {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    phone,
    specialty,
    createdAt: new Date().toISOString(),
  };
}

function toPublicProfessional(professional) {
  const { password, ...publicProfessional } = professional;
  return publicProfessional;
}

module.exports = { createProfessional, toPublicProfessional };
