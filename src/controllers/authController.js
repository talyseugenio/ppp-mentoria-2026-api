const authService = require('../services/authService');

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ error: error.message });
}

function registerClient(req, res) {
  try {
    const client = authService.registerClient(req.body);
    return res.status(201).json(client);
  } catch (error) {
    return handleError(res, error);
  }
}

function registerProfessional(req, res) {
  try {
    const professional = authService.registerProfessional(req.body);
    return res.status(201).json(professional);
  } catch (error) {
    return handleError(res, error);
  }
}

function loginClient(req, res) {
  try {
    const result = authService.loginClient(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

function loginProfessional(req, res) {
  try {
    const result = authService.loginProfessional(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  registerClient,
  registerProfessional,
  loginClient,
  loginProfessional,
};
