const express = require('express');
const router = express.Router();
const { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, uploadDocument, getDepartments } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/departments', protect, getDepartments);
router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployee);
router.post('/', protect, authorize('admin', 'hr'), createEmployee);
router.put('/:id', protect, authorize('admin', 'hr'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);
router.post('/:id/documents', protect, authorize('admin', 'hr'), upload.single('document'), uploadDocument);

module.exports = router;
