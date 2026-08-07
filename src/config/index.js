module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'barbearia-secret-key',
  jwtExpiresIn: '24h',
  businessHours: {
    opening: '09:00',
    closing: '18:00',
  },
  slotIntervalMinutes: 30,
};
