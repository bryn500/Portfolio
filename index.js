/**
 * dependencies
 */
import http from 'http';
import app from './server/server.js';


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

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
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = `${
        typeof addr === 'string' ? 'pipe' : 'port'
        } ${
        typeof addr === 'string' ? addr : addr.port
        }`;
    console.log(`Server running on ${bind}`);
}

/**
 * Start server.
 */
server.on('listening', onListening);
server.listen(port);
