const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, department } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'patient',
      department: department || null
    })
    await user.save()
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      token: generateToken(user._id)
    })
  }catch (error) {
    console.error('Register error FULL:', error)
    return res.status(500).json({ message: error.message, stack: error.stack })
  }

}

const getProfile = async (req, res) => {
  return res.json(req.user)
}

module.exports = { register, login, getProfile }