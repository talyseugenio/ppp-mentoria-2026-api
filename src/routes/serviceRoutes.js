const express = require('express');
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', serviceController.findAll);
router.get('/:id', serviceController.findById);
router.post('/', authenticate, authorize('professional'), serviceController.create);

module.exports = router;
