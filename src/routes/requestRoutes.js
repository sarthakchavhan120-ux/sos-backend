const express = require('express')
const router = express.Router()
const { createRequest, getMyRequests, getDepartmentRequests, updateRequestStatus } = require('../controllers/requestController')
const { protect, staffOnly } = require('../middleware/authMiddleware')

router.post('/', protect, createRequest)
router.get('/my', protect, getMyRequests)
router.get('/department', protect, staffOnly, getDepartmentRequests)
router.put('/:id/status', protect, staffOnly, updateRequestStatus)

module.exports = router