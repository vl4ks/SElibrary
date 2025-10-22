const createApp = require('./src/app')

const port = process.env.PORT

const app = createApp()

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})