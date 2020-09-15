const Sequelize = require('sequelize')
const db = require('./database')

const Puppy = db.define('puppy', {
  name: {
    type: Sequelize.STRING,
    allownull: false,
    validate: {
      notEmpty: true
    }
  },
  age: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = Puppy
