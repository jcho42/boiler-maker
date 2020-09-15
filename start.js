const { db } = require('./server/db')
const app = require('./server')

const startServer = async () => {
  await db.sync()
  // PORT listening (Starting server)
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
  })
}

startServer()
