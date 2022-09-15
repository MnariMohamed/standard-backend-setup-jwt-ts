"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
/************************ */
app_1.app.use(express_1.default.static("src/cli/public"));
app_1.app.use(express_1.default.json({
    limit: '50mb',
    type: ['application/json', 'text/plain']
}));
app_1.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: false }));
//this is new
app_1.app.use(body_parser_1.default.json());
/************************/
const normalizePort = (val) => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
};
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
const onListening = () => {
    const addr = server.address();
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    console.log('Listening on ' + bind);
};
const port = normalizePort(process.env.PORT || 3000);
app_1.app.set('port', port);
const server = http_1.default.createServer(app_1.app);
/***** io ******/
const io = require('./utils/socket').init(server);
io.on("connection", (socket) => { console.log("socket connected"); });
app_1.app.use(function (req, res, next) {
    req.io = io;
    next();
});
/*****************/
server.on('listening', onListening);
server.on('error', onError);
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
    console.log('Connected to database ' + process.env.MONGO_URI);
    server.listen(port);
})
    .catch((err) => {
    console.log(err);
    throw new Error('Error on connecting to database');
});
//# sourceMappingURL=server.js.map