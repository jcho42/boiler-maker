const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { User } = require('../db')

require('../../secrets')

router.get('/', passport.authenticate('google', {scope: 'email'}))

router.get('/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}

const verificationCallback = async (token, refreshToken, profile, done) => {
  const info = {
    name: profile.displayName,
    email: profile.emails[0].value,
    imageUrl: profile.photos ? profile.photos[0].value : undefined
  }
  try {
    const [user] = await User.findOrCreate({
      where: {googlId: profile.id},
      defaults: info
    })
    done(null, user)
  } catch (error) {
    done(error)
  }
}

passport.use(new GoogleStrategy(googleConfig, verificationCallback))

module.exports = router
