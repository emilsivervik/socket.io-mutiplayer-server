'use strict'

import Server from './js/Game/Server'

let gameport        = process.env.PORT || 8080;
let io 				= require('socket.io').listen(8080);

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

let GameServer = new Server(io);