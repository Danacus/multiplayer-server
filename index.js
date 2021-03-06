"use strict";

var colyseus = require('colyseus')
  , http = require('http')

  , express = require('express')
  , app = express()
  , port = 3553

  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

gameServer.register('game_room', require('./rooms/game_room'))
server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
