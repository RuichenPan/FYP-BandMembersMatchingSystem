import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import cfg from './cfg';
import UserService from './service/UserService';
import SocketService from './service/SocketService';
import router from './api';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set static directory
console.log(`(path.join(__dirname, 'public')`, path.join(__dirname, 'public'));
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
  const opt = { useUnifiedTopology: true, useNewUrlParser: true };
  mongoose.connect(cfg.dbConn, opt, (err) => {
    if (err) {
      throw err;
    }
    UserService.log('Connected to mongodb success');
    UserService.initSendGrid();
  });
};

const server = require('http').createServer(app);
const ss = new SocketService(server);

const port = process.env.PORT || 5300;
server.listen(port, () => {
  MongoDbConn();
  ss.initStart();
  UserService.log(`http://localhost:${port}`);
});
