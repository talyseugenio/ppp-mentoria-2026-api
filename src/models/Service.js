const { v4: uuidv4 } = require('uuid');

function createService({ name, description, duration, price }) {
  return {
    id: uuidv4(),
    name,
    description,
    duration,
    price,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createService };
