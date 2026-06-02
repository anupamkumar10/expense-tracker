require('dotenv').config()
const { createApp } = require('./app')
const { connectDB } = require('./config/db')

async function start() {
  await connectDB(process.env.MONGODB_URI)

  const app = createApp()
  const port = Number(process.env.PORT || 5000)

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err)
  process.exit(1)
})

