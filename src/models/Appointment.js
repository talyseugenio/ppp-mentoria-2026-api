const { v4: uuidv4 } = require('uuid');

const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

function createAppointment({ clientId, professionalId, serviceId, date, startTime, endTime }) {
  return {
    id: uuidv4(),
    clientId,
    professionalId,
    serviceId,
    date,
    startTime,
    endTime,
    status: APPOINTMENT_STATUS.SCHEDULED,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createAppointment, APPOINTMENT_STATUS };
