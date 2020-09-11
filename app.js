const {join} = require('path')
require('dotenv').config({
  path: join(__dirname, `.env.${process.env.NODE_ENV || 'dev'}`)
})

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { consoleLogger } = require('./logs')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(consoleLogger)


app.all('/', function(req, res) {
  res.send('Hello World!')
})

module.exports = app
