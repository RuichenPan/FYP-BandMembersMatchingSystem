import React, { useContext, useEffect, useState } from 'react';
import GoBack from '../components/GoBack/GoBack';
import MyImage from '../components/MyImage/MyImage';
import { UserContext } from '../contexts/userContext';
import HttpHelper from '../api/httpHelper';
import Util from '../util';

const ChatPage = (props) => {
  const { id } = Util.parseQuery();
  const context = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const [msg, setMsg] = useState('');
  const [unReadMap, setUnreadMap] = useState({});
  const [userMsgMap, setUserMsgMap] = useState({});
  const [chatWinBodyRef, setChatWinBodyRef] = useState(React.createRef());
  const [uid, setUid] = useState(id);

  context.state.chatSelectUserId = uid;

  useEffect(() => {
    myChatList();
    sendMsg({ cmd: 'Login' });

    onSocketListen();
  }, [context]);

  /**
   * listen socket event
   *
   */
  const onSocketListen = () => {
    // context.socket.removeAllListeners('message');
    const self = this;
    context.socket.on('message', (body) => {
      const { id: login_user_id } = context.state.userInfo || {};
      const { chatSelectUserId } = context.state;
      console.log(chatWinBodyRef);
      console.log(self);
      console.log('body:', body);
      switch (body.cmd) {
        case 'unReadStati':
          setUnreadMap(body.data);
          context.state.unReadMap = body.data;
          sendMsg({ cmd: 'MsgList', select_user_id: uid });
          // console.log('body.data:', JSON.stringify(body));
          break;
        case 'MsgList':
          const tmp1 = context.state.userMsgMap || {};
          tmp1[chatSelectUserId] = body.list;
          setUserMsgMap(tmp1);
          context.onSaveUserMsgMap(tmp1);
          setUserMsgMap({ ...context.state.userMsgMap });
          chatWinBodyRef.current.scrollTop += 1000;
          // console.log(JSON.stringify(body.list));
          break;
        case 'Msg':
          const tmp = context.state.userMsgMap || {};
          const { user_id, to_user_id } = body.data;
          if (login_user_id === to_user_id) {
            // Message received
            if (user_id != chatSelectUserId) {
              context.state.unReadMap[user_id] = (context.state.unReadMap[user_id] || 0) + 1;
              setUnreadMap({ ...context.state.unReadMap });
            } else {
              // Current chat window
              if (!tmp[chatSelectUserId]) {
                tmp[chatSelectUserId] = [];
              }
              tmp[chatSelectUserId].push(body.data);
            }
          }
          if (user_id === login_user_id) {
            // Current chat window
            if (!tmp[chatSelectUserId]) {
              tmp[chatSelectUserId] = [];
            }
            tmp[chatSelectUserId].push(body.data);
          }
          context.onSaveUserMsgMap(tmp);
          setUserMsgMap({ ...context.state.userMsgMap });

          // scroll to the end
          chatWinBodyRef.current.scrollTop += 1000;
        default:
          break;
      }
    });
  };

  /**
   * get i want you list
   *
   */
  const myChatList = async () => {
    const { favorite_mine } = context.state;
    if (favorite_mine && favorite_mine.list && favorite_mine.list.length > 0) {
      setChatList(favorite_mine.list);
    } else {
      await context.onGetFavoritesList();
      const { list } = context.state.favorite_mine || {};
      setChatList(list);
    }
  };

  /**
   * send msg
   *
   * @param {*} data
   */
  const sendMsg = (data) => {
    data.token = HttpHelper.token;
    const { id: user_id } = context.userInfo || context.state.userInfo;
    data.user_id = user_id;
    context.socket.send(data);
  };

  const handleSocket = () => {
    sendMsg({ cmd: 'Msg', msg, to_user_id: uid });
    setMsg('');
  };

  const handleMsgList = (item) => {
    setUid(item.id);
    context.state.chatSelectUserId = item.id;
    sendMsg({ cmd: 'MsgList', select_user_id: item.id });
  };

  const { id: user_id } = context.state.userInfo || {};
  return (
    <div>
      <GoBack />

      <div className="row">
        <div className="col1 " style={{ border: '1px solid #f0f0f0', marginRight: '5px ', minWidth: '190px' }}>
          <h5 className="text-center">I Want you list</h5>
          {chatList &&
            chatList.map((item, index) => {
              return (
                <div key={index} className="row margin-bottom-5 handle" style={{ background: uid == item.id ? '#f0f0f0' : '' }} onClick={() => handleMsgList(item)}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                    <MyImage avatar={item.avatar} />
                  </div>
                  <div className="margin-left-10">
                    <div className=" ">
                      <span className=" font-size-20">{item.username}</span>
                      <span className="margin-left-10 badge badge-primary">{unReadMap[item.id]}</span>
                    </div>
                    <div className="font-size-16">{item.email}</div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="col4">
          <div className="padding-20 chat-win-body" ref={chatWinBodyRef}>
            {userMsgMap[uid] &&
              userMsgMap[uid].map((item, index) => {
                return (
                  <div key={index}>
                    {user_id != item.user_id && (
                      <div className="row">
                        <div className="chat-avatar margin-right-10">
                          <MyImage avatar={item.avatar} />
                        </div>
                        <div className="chat-center">
                          <div>{Util.format(item.create_time, 'yyyy-mm-dd HH:MM:ss.S')}</div>
                          <div className="chat-msg">{item.msg}</div>
                        </div>
                        <div className="col1"></div>
                      </div>
                    )}

                    {user_id != item.to_user_id && (
                      <div className="row">
                        <div className="col1"></div>
                        <div className="chat-center">
                          <div className="text-right">{Util.format(item.create_time, 'yyyy-mm-dd HH:MM:ss.S')}</div>
                          <div className="chat-msg">{item.msg}</div>
                        </div>
                        <div className="chat-avatar margin-left-10">
                          <MyImage avatar={item.to_avatar} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="row padding-0" style={{ border: '1px solid #f0f0f0' }}>
            <input className="col1" value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button className="btn btn-light" onClick={handleSocket} style={{ width: '100px' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
