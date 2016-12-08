;(function () {
  'use strict'

  var http = require('http')
  var fs = require('fs')
  var socketIo = require('socket.io')

  var PORT = process.env.PORT || 8080
  var HOME_PAGE = './public/index.html'
  var INTERVAL = 100
  var MESSAGE_EVENT = 'message'

  main()

  function main () {
    var app = http.createServer(requestHandler)
    app.listen(PORT)
    console.log('listening on port ' + PORT)

    var io = socketIo(app)
    
    io.on('connection', onConnect)
  }

  function onConnect (socket) {
    console.log('connection: ' + socket.conn.remoteAddress + ' - ' + socket.id)

    setInterval(function () {
      socket.emit(MESSAGE_EVENT, newMessage())
    }, INTERVAL)
  }

  function newMessage () {
    var random = Math.random()

    return {
      data: random
    }
  }

  function requestHandler (request, response) {
    fs.readFile(HOME_PAGE, handleFile)

    function handleFile (error, data) {
      if (error) {
        response.writeHead(500)
        return response.end('Error loading index.html')
      }
  
      response.setHeader('Content-Type', 'text/html')
      response.writeHead(200)
      response.end(data)
    }
  }
})()

