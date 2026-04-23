const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);          // public
router.get('/:id', getJob);        // public
router.post('/', protect, authorize('admin', 'hr'), createJob);
router.put('/:id', protect, authorize('admin', 'hr'), updateJob);
router.delete('/:id', protect, authorize('admin', 'hr'), deleteJob);

module.exports = router;
