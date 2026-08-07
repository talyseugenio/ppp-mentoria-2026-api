const db = require('../database/memory');
const { APPOINTMENT_STATUS, createAppointment } = require('../models/Appointment');
const serviceService = require('./serviceService');
const {
  parseTime,
  timeRangesOverlap,
  isValidDateFormat,
  isValidTimeFormat,
  isPastDateTime,
  isWithinBusinessHours,
  generateTimeSlots,
  validateRequiredFields,
} = require('../utils/time');

function findProfessionalById(id) {
  const professional = db.professionals.find((p) => p.id === id);
  if (!professional) {
    const error = new Error('Profissional não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return professional;
}

function getScheduledAppointments(filters = {}) {
  return db.appointments.filter((appointment) => {
    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) return false;
    if (filters.professionalId && appointment.professionalId !== filters.professionalId) return false;
    if (filters.clientId && appointment.clientId !== filters.clientId) return false;
    if (filters.date && appointment.date !== filters.date) return false;
    return true;
  });
}

function hasConflict({ professionalId, clientId, date, startTime, endTime, excludeId }) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const scheduled = getScheduledAppointments({ date });

  for (const appointment of scheduled) {
    if (excludeId && appointment.id === excludeId) continue;

    const apptStart = parseTime(appointment.startTime);
    const apptEnd = parseTime(appointment.endTime);

    if (timeRangesOverlap(start, end, apptStart, apptEnd)) {
      if (appointment.professionalId === professionalId) {
        return { conflict: true, reason: 'Profissional já possui agendamento neste horário' };
      }
      if (appointment.clientId === clientId) {
        return { conflict: true, reason: 'Cliente já possui agendamento neste horário' };
      }
    }
  }

  return { conflict: false };
}

function getAvailableTimes({ professionalId, serviceId, date }) {
  validateRequiredFields({ professionalId, serviceId, date }, ['professionalId', 'serviceId', 'date']);

  if (!isValidDateFormat(date)) {
    const error = new Error('Formato de data inválido. Use YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  findProfessionalById(professionalId);
  const service = serviceService.findById(serviceId);

  const allSlots = generateTimeSlots(service.duration);
  const professionalAppointments = getScheduledAppointments({ professionalId, date });
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const available = allSlots.filter((slot) => {
    if (date === todayStr && isPastDateTime(date, slot.startTime)) {
      return false;
    }

    const slotStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);

    const hasProfessionalConflict = professionalAppointments.some((appointment) => {
      const apptStart = parseTime(appointment.startTime);
      const apptEnd = parseTime(appointment.endTime);
      return timeRangesOverlap(slotStart, slotEnd, apptStart, apptEnd);
    });

    return !hasProfessionalConflict;
  });

  return {
    date,
    professionalId,
    serviceId,
    serviceDuration: service.duration,
    availableTimes: available,
  };
}

function create(data, clientId) {
  validateRequiredFields(data, ['professionalId', 'serviceId', 'date', 'startTime']);

  const { professionalId, serviceId, date, startTime } = data;

  if (!isValidDateFormat(date)) {
    const error = new Error('Formato de data inválido. Use YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  if (!isValidTimeFormat(startTime)) {
    const error = new Error('Formato de horário inválido. Use HH:mm');
    error.statusCode = 400;
    throw error;
  }

  if (isPastDateTime(date, startTime)) {
    const error = new Error('Não é permitido agendar em datas ou horários passados');
    error.statusCode = 400;
    throw error;
  }

  findProfessionalById(professionalId);
  const service = serviceService.findById(serviceId);

  const startMinutes = parseTime(startTime);
  const endMinutes = startMinutes + service.duration;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

  if (!isWithinBusinessHours(startTime, endTime)) {
    const error = new Error('Agendamento fora do horário de funcionamento (09:00 - 18:00)');
    error.statusCode = 400;
    throw error;
  }

  const conflict = hasConflict({ professionalId, clientId, date, startTime, endTime });
  if (conflict.conflict) {
    const error = new Error(conflict.reason);
    error.statusCode = 409;
    throw error;
  }

  const appointment = createAppointment({
    clientId,
    professionalId,
    serviceId,
    date,
    startTime,
    endTime,
  });

  db.appointments.push(appointment);
  return enrichAppointment(appointment);
}

function enrichAppointment(appointment) {
  const client = db.clients.find((c) => c.id === appointment.clientId);
  const professional = db.professionals.find((p) => p.id === appointment.professionalId);
  const service = db.services.find((s) => s.id === appointment.serviceId);

  return {
    ...appointment,
    client: client ? { id: client.id, name: client.name, email: client.email } : null,
    professional: professional ? { id: professional.id, name: professional.name, specialty: professional.specialty } : null,
    service: service ? { id: service.id, name: service.name, duration: service.duration, price: service.price } : null,
  };
}

function findAll(user) {
  let appointments;

  if (user.role === 'client') {
    appointments = db.appointments.filter((a) => a.clientId === user.id);
  } else if (user.role === 'professional') {
    appointments = db.appointments;
  } else {
    appointments = [];
  }

  return appointments.map(enrichAppointment);
}

function findById(id, user) {
  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) {
    const error = new Error('Agendamento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'client' && appointment.clientId !== user.id) {
    const error = new Error('Acesso negado. Você só pode visualizar seus próprios agendamentos');
    error.statusCode = 403;
    throw error;
  }

  return enrichAppointment(appointment);
}

function cancel(id, user) {
  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) {
    const error = new Error('Agendamento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'client' && appointment.clientId !== user.id) {
    const error = new Error('Acesso negado. Você só pode cancelar seus próprios agendamentos');
    error.statusCode = 403;
    throw error;
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    const error = new Error('Agendamento já está cancelado');
    error.statusCode = 400;
    throw error;
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    const error = new Error('Não é possível cancelar um agendamento concluído');
    error.statusCode = 400;
    throw error;
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  return enrichAppointment(appointment);
}

function complete(id, professionalId) {
  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) {
    const error = new Error('Agendamento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (appointment.professionalId !== professionalId) {
    const error = new Error('Apenas o profissional responsável pode concluir o atendimento');
    error.statusCode = 403;
    throw error;
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    const error = new Error('Não é possível concluir um agendamento cancelado');
    error.statusCode = 400;
    throw error;
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    const error = new Error('Agendamento já está concluído');
    error.statusCode = 400;
    throw error;
  }

  appointment.status = APPOINTMENT_STATUS.COMPLETED;
  return enrichAppointment(appointment);
}

module.exports = {
  getAvailableTimes,
  create,
  findAll,
  findById,
  cancel,
  complete,
};
