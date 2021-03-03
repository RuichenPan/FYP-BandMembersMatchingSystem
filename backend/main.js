import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import cfg from './cfg';
import UserService from './service/UserService';
import socketio from 'socket.io';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const router = require('./api/index');

// set static directory
app.use(express.static(path.join(__dirname, 'public')));

// Cross domain processing
app.use(async (req, res, next) => {
  const { method, url } = req;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization,token, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    UserService.log('method:', method.toLowerCase(), url);
    const { token } = req.headers;
    if (token) {
      const [isExpired, info] = await UserService.CheckToken(token);
      if (!isExpired) {
        UserService.log(JSON.stringify(info));
        req.userInfo = info;
      }
    }
    await next();
  }
});

// set api router
router(app);

// create mongodb connection
const MongoDbConn = () => {
  // mongoose.Promise = global.Promise;
   
  mongoose.connect(cfg.dbConn, { useUnifiedTopology: true, useNewUrlParser: true }, function (err) {
    if (err) throw err;
    UserService.log('Connected to mongodb success');
  });
};

const server = require('http').createServer(app);
const io = socketio(server, { path: '/chat', cors: { origin: '*' } });
const socketMap = {};
io.on('connection', (socket) => {
  UserService.log('------------------', io.engine.clientsCount, socket.id);
  socketMap[socket.id] = socket;
  socket.on('msg', (data) => {
    UserService.log('data-->', data);
    // socket.emit('msg', { msg: data, ts: new Date().getTime() });
    Object.values(socketMap).forEach((client) => {
      client.emit('msg', { id: client.id, msg: data.msg, ts: new Date().getTime() });
    });
  });

});

const port = process.env.PORT || 5300;
server.listen(port, () => {
  MongoDbConn();
  UserService.log(`http://localhost:${port}`);
});
