const Sequelize = require('sequelize')
const crypto = require('crypto')
const _ = require('lodash')

const db = require('./database')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  imageUrl: {
    type: Sequelize.TEXT
  }
})

// Instance methods
// Returns true if the entered passwork matches
User.prototype.correctPassword = function(enteredPassword) {
  return User.encryptPassword(enteredPassword, this.salt()) === this.password()
}

// use sanitize method to omit sensitive info when sending data(srubbing)
User.prototype.sanitize = () => {
  // first argument is the source obj; second is  the properties to omit
  return _.omit(this.toJSON(), ['password', 'salt'])
}

// Class methods
// generates random salt
User.generateSalt = () => {
  return crypto.randomBytes(16).toString('base64')
}

// Takes a plain text and salt and returns its hash
User.encryptPassword = (plainText, salt) => {
  // specify which hash algorithm to use
  const hash = crypto.createHash('sha1')
  hash.update(plainText)
  hash.update(salt)
  return hash.digest('hex')
}

// Salt password function
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

// Hooks
// salt and hash when user creates/updates their password
User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

module.exports = User
