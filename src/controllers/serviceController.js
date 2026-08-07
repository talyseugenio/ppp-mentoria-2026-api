const serviceService = require('../services/serviceService');

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ error: error.message });
}

function create(req, res) {
  try {
    const service = serviceService.create(req.body);
    return res.status(201).json(service);
  } catch (error) {
    return handleError(res, error);
  }
}

function findAll(req, res) {
  try {
    const services = serviceService.findAll();
    return res.status(200).json(services);
  } catch (error) {
    return handleError(res, error);
  }
}

function findById(req, res) {
  try {
    const service = serviceService.findById(req.params.id);
    return res.status(200).json(service);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = { create, findAll, findById };
