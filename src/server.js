const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: '🚨 Emergency360 API is running!' })
})

// Test register route directly
app.post('/api/auth/test', async (req, res) => {
  console.log('Test route hit:', req.body)
  res.json({ received: req.body })
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/requests', require('./routes/requestRoutes'))

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err)
  res.status(500).json({ message: err.message, stack: err.stack })
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })