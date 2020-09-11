const morgan = require('morgan')
const chalk = require('chalk')

const getColorForStatus = (text, status) => {
  const colors = {
    1: text => chalk.cyan(text),
    2: text => chalk.green(text),
    3: text => chalk.green(text),
    4: text => chalk.red(text),
    5: text => chalk.red(text),
    default: text => chalk.white(text),
  }

  return colors[String(status)[0]](text) || colors['default'](text)
}

morgan.token('status', (req, res) =>
  getColorForStatus(res.statusCode, res.statusCode)
)
morgan.token('method', (req, res) => chalk.bold(`[ ${req.method} ]`))
morgan.token('url', (req, res) => chalk.yellow(`"${req.path}"`))
morgan.token('date', (req, res) => chalk.white(` ${new Date().toUTCString()} `))


const consoleLogger = morgan((tokens, req, res) => [
  [
    tokens.method(req, res),
    tokens.url(req, res),
    '-',
    tokens.status(req, res),
    '--',
    tokens.date(req, res),
    '--',
    chalk.yellow.italic(`${tokens['response-time'](req, res)} ms`),
  ].join(' '),
])

const errorLogger = morgan(
  (tokens, req, res) => {
    const status = String([res.statusCode])[0]
    if (status === '4' || status === '5') {
      return `${new Date().toISOString()} -- [ ${req.method} ] -- path: "${
        req.path
      }" code: ${res.statusCode} error: ${res.statusMessage}`
    }
  }
)


module.exports = { consoleLogger }
