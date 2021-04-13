import socketio from 'socket.io';
import ChatService from './ChatService';
import UserService from './UserService';

export default class SocketService {
  constructor(server) {
    const io = socketio(server, { path: '/chat', cors: { origin: '*' } });
    this.serverSocket = io;
    this.socketMap = {};
  }

  initStart() {
    const self = this;
    this.serverSocket.on('connection', (socket) => {
      ChatService.log(this.serverSocket.engine.clientsCount, socket.id);
      socket.on('message', (data) => {
        console.log('user_id:', data.user_id);
        self.process_cmd(socket, data);
      });
    });
  }

  sendMsg(socket, data) {
    data.ts = new Date();
    socket.send(data);
  }

  async process_cmd(socket, data) {
    // ChatService.log('accept data:', data);
    const { cmd, user_id, token } = data;
    const cmd_fun = `CMD_${cmd}`;
    ChatService.log('cmd func name:', cmd_fun);

    if (!this.socketMap[user_id]) {
      this.socketMap[user_id] = await UserService.findById(user_id);
    }

    this.socketMap[user_id].socket = socket;
    data.userInfo = this.socketMap[user_id];

    delete data.token;

    if (this[cmd_fun]) {
      this[cmd_fun](socket, data);
    } else {
      ChatService.log('cmd not found:', cmd_fun);
      this.sendMsg(socket, { cmd: 'notfound' });
    }
  }

  /**
   * get message list
   *
   * @param {*} socket
   * @param {*} data
   * @memberof SocketService
   */
  async CMD_MsgList(socket, data) {
    const { user_id: to_user_id, select_user_id: user_id } = data;
    const list = await ChatService.find(
      {
        $or: [
          { to_user_id, user_id },
          { user_id: to_user_id, to_user_id: user_id },
        ],
      },
      { update_time: 0, state: 0, _id: 0 },
      { sort: { create_time: -1 }, limit: 100 },
    );
    list.reverse();

    // update state , set state = 2
    await ChatService.updateMany({ to_user_id, user_id }, { state: 2 });
    this.sendMsg(socket, { cmd: 'MsgList', list });
  }

  /**
   * login ; return unread statistics
   *
   * @param {*} socket
   * @param {*} data
   * @memberof SocketService
   */
  async CMD_Login(socket, data) {
    const { id: to_user_id } = data.userInfo;
    const condition = [{ $match: { state: 1 } }, { $group: { _id: { user_id: '$user_id', to_user_id: '$to_user_id' }, totalUnread: { $sum: 1 } } }, { $match: { '_id.to_user_id': to_user_id } }];
    const list = await ChatService.aggregate(condition);
    const infoMap = {};
    if (list) {
      list.forEach((item) => {
        item.user_id = item._id.user_id;
        delete item._id;
        infoMap[item.user_id] = item.totalUnread;
      });
    }
    this.sendMsg(socket, { cmd: 'unReadStati', data: infoMap });
  }

  /**
   * send msg
   *
   * @param {*} socket
   * @param {*} data
   * @memberof SocketService
   */
  async CMD_Msg(socket, data) {
    const { id: user_id, username, avatar } = data.userInfo;
    const { to_user_id, msg } = data;
    // const { username: to_username, avatar: to_avatar } = this.socketMap[to_user_id] || (await UserService.findById(to_user_id));
    const { username: to_username, avatar: to_avatar } = await UserService.findById(to_user_id);
    const row = { user_id, username, avatar, to_user_id, to_username, to_avatar, msg };

    // console.log('to_username:', user_id, to_user_id, avatar, to_avatar);

    // save msg to data base
    const info = await ChatService.save(row);

    this.sendMsg(socket, { cmd: 'Msg', data: info || row });
    const { socket: to_socket } = this.socketMap[to_user_id] || {};
    if (to_socket) {
      // console.log('--->', row);
      this.sendMsg(to_socket, { cmd: 'Msg', data: info || row });
      to_socket.emit('msgRemind', { cmd: 'msgRemind', data: info || row });
    }
  }
}
