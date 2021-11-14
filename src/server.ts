/* tslint:disable */
import app from './app' ;
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

// Get port from env vars.
const port = (process.env.PORT)? process.env.PORT : 8080 ;
// run server.
const server = http.createServer(app);
server.listen(port, () =>{
  console.log("Server listening on Port", port);
});

server.on('listening', onListening);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}