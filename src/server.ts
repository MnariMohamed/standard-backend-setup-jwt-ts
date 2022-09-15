require('dotenv').config();
import http from 'http';
import { app } from './app';
import mongoose, { ConnectOptions } from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';




/************************ */
app.use(express.static("src/cli/public"));

app.use(express.json({
  limit: '50mb',
  type: ['application/json', 'text/plain']
}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
//this is new
app.use(bodyParser.json())


/************************/

const normalizePort = (val: any) => {
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

const onError = (error: any) => {
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

const port = normalizePort(process.env.PORT || 3010);
app.set('port', port);

const server = http.createServer(app);


/***** io ******/
const io = require('./tools/socket').init(server);
io.on("connection", (socket: any) => { console.log("socket connected"); });

app.use(function (req, res, next) {
  (<any>req).io = io;
  next();
});
/*****************/


server.on('listening', onListening);
server.on('error', onError);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => {
    console.log('Connected to database ' + process.env.MONGO_URI);
    server.listen(port);
  })
  .catch((err: any) => {
    console.log(err);
    throw new Error('Error on connecting to database');
  });


