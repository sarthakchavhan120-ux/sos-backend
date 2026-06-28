const EmergencyRequest = require('../models/EmergencyRequest')

const departmentMap = {
  ambulance: 'ambulance',
  national: 'ambulance',
  police: 'police',
  women: 'police',
  child: 'police',
  senior: 'police',
  fire: 'fire',
  disaster: 'disaster',
}

const createRequest = async (req, res) => {
  try {
    const { serviceType, latitude, longitude, address } = req.body
    const department = departmentMap[serviceType] || 'police'
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`
    const request = await EmergencyRequest.create({
      patient: req.user._id,
      patientName: req.user.name,
      patientPhone: req.user.phone,
      serviceType,
      department,
      latitude,
      longitude,
      googleMapsLink,
      address: address || '',
    })
    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ patient: req.user._id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getDepartmentRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ department: req.user.department }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateRequestStatus = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Request not found' })

    const { status } = req.body

    if (status === 'accepted') {
      if (request.status !== 'waiting') {
        return res.status(400).json({ message: 'Request already accepted by someone else' })
      }
      request.assignedTo = req.user._id
      request.assignedAt = new Date()
    }

    if (status === 'completed') {
      request.completedAt = new Date()
    }

    request.status = status
    await request.save()
    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createRequest, getMyRequests, getDepartmentRequests, updateRequestStatus }