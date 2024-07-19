const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.delete('/:id', paymentController.deletePayment);

// GET monthly payment totals
router.get('/monthly-totals', paymentController.getMonthlyTotals);

module.exports = router;
