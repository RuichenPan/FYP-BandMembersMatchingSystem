import socketio from 'socket.io';
import ChatService from './ChatService';

export default class SocketService {
  constructor(server) {
    const io = socketio(server, { path: '/chat', cors: { origin: '*' } });
    this.serverSocket = io;
    this.socketMap = {};
  }

  initStart() {
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
        ChatService.log('accept data:', data);
      });
    });
  }

  socket_msg(client, data) {}
}
