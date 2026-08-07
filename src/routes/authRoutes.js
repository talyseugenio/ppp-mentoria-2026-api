const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/clients/register', authController.registerClient);
router.post('/professionals/register', authController.registerProfessional);
router.post('/clients/login', authController.loginClient);
router.post('/professionals/login', authController.loginProfessional);

module.exports = router;
