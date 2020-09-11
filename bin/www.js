const app = require('../app')
const http = require('http')
const chalk = require('chalk')


const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.log(chalk.red(`${bind} requires elevated privileges`))
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.log(chalk.red(`${bind} is already in use`))
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? addr : `http://localhost:${addr.port}`
  console.log(`Server is listening on ${chalk.green(bind)}`)
}
