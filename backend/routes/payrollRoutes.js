const express = require('express');
const router = express.Router();
const { processPayroll, getPayroll, getPayslip, markPaid, updatePayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/process', protect, authorize('admin', 'hr'), processPayroll);
router.get('/',         protect, getPayroll);
router.get('/:id',      protect, getPayslip);
router.put('/:id',      protect, authorize('admin', 'hr'), updatePayroll);
router.put('/:id/pay',  protect, authorize('admin', 'hr'), markPaid);

module.exports = router;
