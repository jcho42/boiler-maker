const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { db, User } = require('./db')
const passport = require('passport')

const app = express()

require('../secrets')

// Logging middleware
app.use(morgan('dev'))

// Body parsing Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Configure and create database store (to store session info in our database)
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const dbStore = new SequelizeStore({db: db})
// sync so that our session table gets created
dbStore.sync()

// Session middleware (with session store)
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: dbStore,
  resave: false,
  saveUninitialized: false
}))

// Initialize passport (consume req.session)
app.use(passport.initialize())
app.use(passport.session())

// Serialize passport (store user id in session store)
passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (error) {
    done(error)
  }
})

// Deserialize passport (Look up user in session and attach req.user)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

// Static middleware (so your browser can request things like your 'bundle.js')
app.use(express.static(path.join(__dirname, '../public')))

// API/AUTH Routes
app.use('/api', require('./apiRoutes'))
app.use('/auth', require('./authRoutes'))

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

