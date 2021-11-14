"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Get port from env vars.
const port = (process.env.PORT) ? process.env.PORT : 8080;
// run server.
const server = http_1.default.createServer(app_1.default);
server.listen(port, () => {
    console.log("Server listening on Port", port);
});
server.on('listening', onListening);
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}
//# sourceMappingURL=server.js.map