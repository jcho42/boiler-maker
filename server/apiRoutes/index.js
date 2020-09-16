const router = require('express').Router()

router.use('/users', require('./users'))

// Error handler (404)
router.use((req, res, next) => {
  const err = new Error('Page not found')
  err.status = 404
  next(err)
})

module.exports = router
