const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

function createClient({ name, email, password, phone }) {
  return {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    phone,
    createdAt: new Date().toISOString(),
  };
}

function toPublicClient(client) {
  const { password, ...publicClient } = client;
  return publicClient;
}

module.exports = { createClient, toPublicClient };
