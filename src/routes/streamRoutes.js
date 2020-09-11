const express = require('express')
const { join } = require('path')
const streamRouter = express.Router()
const StreamController = require('../controllers/streamController')

const VIEW_DIR = join(__dirname, '..', 'views')

streamRouter.get('/', express.static(VIEW_DIR))
streamRouter.get('/video/:id', StreamController.streamVideo)

module.exports = streamRouter
