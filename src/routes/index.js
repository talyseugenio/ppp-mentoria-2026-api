const express = require('express');
const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
