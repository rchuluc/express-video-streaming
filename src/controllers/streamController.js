const { join } = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { start } = require('repl')
const asyncStat = promisify(fs.stat)

function streamFile(filename, options) {
  return fs.createReadStream(filename, {
    ...options,
    emitClose: true,
  })
}

async function getFileSize(filename) {
  try {
    const { size } = await asyncStat(filename)
    return size
  } catch (error) {
    return false
  }
}

function chunkFile(range, size) {
  const parts = range.replace(/bytes=/, '').split('-')
  const start = parseInt(parts[0], 10)
  const end = parts[1] ? parseInt(parts[1], 10) : size - 1
  const chunkSize = end - start + 1

  return {
    start,
    end,
    chunkSize,
  }
}

async function streamToClient({ range, size, file }, res) {
  const { start, end, chunkSize } = chunkFile(range, size)

  if (range) {
    res.set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    })

    res.status(206)
  } else {
    res.set({
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    })

    res.status(200)
  }

  const stream = streamFile(file, {
    start,
    end,
  })

  stream.on('error', error => {
    console.error('error', error)
    res.status(500)
    return
  })

  stream.pipe(res)
}

class StreamController {
  static async streamVideo(req, res) {
    const { range } = req.headers
    const { id: filename } = req.params

    const FILE_PATH = join(__dirname, '..', 'bucket', `${filename}.mp4`)

    const size = await getFileSize(FILE_PATH)

    if (!size) {
      res.status(404)
      return
    }

    const data = {
      range,
      size,
      file: FILE_PATH,
    }

    return streamToClient(data, res)
  }

  static async streamAudio(req, res) {
    const { range } = req.headers
    const { id: filename } = req.params

    const FILE_PATH = join(__dirname, '..', 'bucket', `${filename}.mp3`)

    const size = await getFileSize(FILE_PATH)

    if (!size) {
      res.status(404)
      return
    }

    const data = {
      range,
      size,
      file: FILE_PATH,
    }

    return streamToClient(data, res)
  }
}

module.exports = StreamController
