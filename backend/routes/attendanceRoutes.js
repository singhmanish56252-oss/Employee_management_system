const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, updateAttendance, applyLeave, getLeaves, updateLeave } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Attendance
router.post('/',         protect, authorize('admin', 'hr'), markAttendance);
router.get('/',          protect, getAttendance);
router.put('/:id',       protect, authorize('admin', 'hr'), updateAttendance);

// Leaves
router.post('/leave',    protect, applyLeave);
router.get('/leaves',    protect, getLeaves);
router.put('/leave/:id', protect, authorize('admin', 'hr'), updateLeave);

module.exports = router;
