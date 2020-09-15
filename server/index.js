const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// Logging middleware
app.use(morgan('dev'))

// Parsing Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Static middleware (so your browser can request things like your 'bundle.js')
app.use(express.static(path.join(__dirname, '../public')))

// API Routes
app.use('/api', require('./apiRoutes'))

// Send Index HTML (for any requests that don't match one of our API routes)
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Error hanndler (500)
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

module.exports = app

