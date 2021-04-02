import socketio from 'socket.io';
import ChatService from './ChatService';

export default class SocketService {
  constructor(server) {
    const io = socketio(server, { path: '/chat', cors: { origin: '*' } });
    this.serverSocket = io;
    this.socketMap = {};
  }

  initStart() {
    const self = this;
    this.serverSocket.on('connection', (socket) => {
      this.socketMap[socket.id] = socket;
      ChatService.log(this.serverSocket.engine.clientsCount, socket.id);
      socket.on('msg', (data) => {
        UserService.log('data-->', data);
        // socket.emit('msg', { msg: data, ts: new Date().getTime() });
        Object.values(socketMap).forEach((client) => {
          client.emit('msg', { id: client.id, msg: data.msg, ts: new Date().getTime() });
        });
      });

      socket.on('message', (data) => {
        self.process_cmd(socket, data);
      });
    });
  }

  sendMsg(socket, data) {
    data.ts = new Date();
    socket.send(data);
  }

  process_cmd(socket, data) {
    ChatService.log('accept data:', data);
    const { cmd } = data;
    const cmd_fun = `CMD_${cmd}`;
    ChatService.log('cmd func name:', cmd_fun);

    if (this[cmd_fun]) {
      this[cmd_fun](socket, data);
    }
  }
  CMD_Login(socket, data) {
    this.sendMsg(socket, { msg: 'login success' });
  }

  CMD_Msg(socket, data) {
    // save msg to data base
    // reply
    // const {user_id,} = data;

    // this.sendMsg({cmd:'Msg',})
  }
}
