const express = require('express');
const router = express.Router();
const { getAdminDashboard, getHRDashboard, getEmployeeDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin',    protect, authorize('admin'), getAdminDashboard);
router.get('/hr',       protect, authorize('admin', 'hr'), getHRDashboard);
router.get('/employee', protect, getEmployeeDashboard);

module.exports = router;
