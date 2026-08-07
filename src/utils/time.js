const config = require('../config');

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function timeRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function isValidDateFormat(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(`${dateStr}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

function isValidTimeFormat(timeStr) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr);
}

function isPastDateTime(dateStr, timeStr) {
  const now = new Date();
  const appointmentDate = new Date(`${dateStr}T${timeStr}:00`);
  return appointmentDate <= now;
}

function isWithinBusinessHours(startTime, endTime) {
  const opening = parseTime(config.businessHours.opening);
  const closing = parseTime(config.businessHours.closing);
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  return start >= opening && end <= closing;
}

function generateTimeSlots(durationMinutes) {
  const opening = parseTime(config.businessHours.opening);
  const closing = parseTime(config.businessHours.closing);
  const interval = config.slotIntervalMinutes;
  const slots = [];

  for (let start = opening; start + durationMinutes <= closing; start += interval) {
    slots.push({
      startTime: formatTime(start),
      endTime: formatTime(start + durationMinutes),
    });
  }

  return slots;
}

function validateRequiredFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    const error = new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  parseTime,
  formatTime,
  timeRangesOverlap,
  isValidDateFormat,
  isValidTimeFormat,
  isPastDateTime,
  isWithinBusinessHours,
  generateTimeSlots,
  validateRequiredFields,
};
