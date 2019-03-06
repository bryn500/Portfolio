"use strict";

var _http = _interopRequireDefault(require("http"));

var _server = _interopRequireDefault(require("./server.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * dependencies
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */


var port = normalizePort(process.env.PORT || 3000);

_server.default.set('port', port);
/**
 * Create HTTP server.
 */


var server = _http.default.createServer(_server.default);
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  var addr = server.address();
  var bind = "".concat(typeof addr === 'string' ? 'pipe' : 'port', " ").concat(typeof addr === 'string' ? addr : addr.port);
  console.log("Server running on ".concat(bind));
}
/**
 * Start server.
 */


server.on('listening', onListening);
server.listen(port);