const express = require('express');
const router = express.Router();
const { getApplications, submitApplication, updateStatus, deleteApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/', upload.single('resume'), submitApplication);  // public
router.get('/', protect, authorize('admin', 'hr'), getApplications);
router.put('/:id/status', protect, authorize('admin', 'hr'), updateStatus);
router.delete('/:id', protect, authorize('admin', 'hr'), deleteApplication);

module.exports = router;
