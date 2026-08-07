const appointmentService = require('../services/appointmentService');

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ error: error.message });
}

function getAvailableTimes(req, res) {
  try {
    const result = appointmentService.getAvailableTimes(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

function create(req, res) {
  try {
    const appointment = appointmentService.create(req.body, req.user.id);
    return res.status(201).json(appointment);
  } catch (error) {
    return handleError(res, error);
  }
}

function findAll(req, res) {
  try {
    const appointments = appointmentService.findAll(req.user);
    return res.status(200).json(appointments);
  } catch (error) {
    return handleError(res, error);
  }
}

function findById(req, res) {
  try {
    const appointment = appointmentService.findById(req.params.id, req.user);
    return res.status(200).json(appointment);
  } catch (error) {
    return handleError(res, error);
  }
}

function cancel(req, res) {
  try {
    const appointment = appointmentService.cancel(req.params.id, req.user);
    return res.status(200).json(appointment);
  } catch (error) {
    return handleError(res, error);
  }
}

function complete(req, res) {
  try {
    const appointment = appointmentService.complete(req.params.id, req.user.id);
    return res.status(200).json(appointment);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  getAvailableTimes,
  create,
  findAll,
  findById,
  cancel,
  complete,
};
