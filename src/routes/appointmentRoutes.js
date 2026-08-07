const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/available', authenticate, appointmentController.getAvailableTimes);
router.post('/', authenticate, authorize('client'), appointmentController.create);
router.get('/', authenticate, appointmentController.findAll);
router.get('/:id', authenticate, appointmentController.findById);
router.patch('/:id/cancel', authenticate, authorize('client'), appointmentController.cancel);
router.patch('/:id/complete', authenticate, authorize('professional'), appointmentController.complete);

module.exports = router;
