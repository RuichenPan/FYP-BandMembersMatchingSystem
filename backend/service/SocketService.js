import socketio from 'socket.io';

export default class SocketService {
  constructor(server) {
    const io = socketio(server, { path: '/chat', cors: { origin: '*' } });
    this.serverSocket = io;
    this.socketMap = {};
  }

  initStart() {
    this.serverSocket.on('connection', (socket) => {
      socketMap[socket.id] = socket;
      socket.on('msg', (data) => {
        UserService.log('data-->', data);
        // socket.emit('msg', { msg: data, ts: new Date().getTime() });
        Object.values(socketMap).forEach((client) => {
          client.emit('msg', { id: client.id, msg: data.msg, ts: new Date().getTime() });
        });
      });
    });
  }

  socket_msg(client,data){
    
  }

}
