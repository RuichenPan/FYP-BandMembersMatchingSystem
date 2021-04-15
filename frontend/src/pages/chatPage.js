import React, { useContext, useEffect, useState } from 'react';
import GoBack from '../components/GoBack/GoBack';
import MyImage from '../components/MyImage/MyImage';
import { UserContext } from '../contexts/userContext';

import Util from '../util';

const ChatPage = (props) => {
  const { id } = Util.parseQuery();
  const context = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const [msg, setMsg] = useState('');
  const [unReadMap, setUnreadMap] = useState({});
  const [userMsgMap, setUserMsgMap] = useState({});
  const [chatWinBodyRef] = useState(React.createRef());
  const [uid, setUid] = useState(id);

  context.state.chatSelectUserId = uid;

  useEffect(() => {
    handleMsgList({ id });
    myChatList();
    onSocketListen();
    console.log('---useEffect--');
    // eslint-disable-next-line
  }, [context, props.history.location.key]);

  /**
   * listen socket event
   *
   */
  const onSocketListen = () => {
    context.socket.removeAllListeners('message');
    context.socket.on('disconnect', async () => {
      console.log('socket disconnect');

      Util.await(1500);
      context.socket.connect();

      if (context.socket.connected) {
        console.log('reconnection success...');
      }
    });
    context.socket.once('connect', () => {
      console.log('socket reconnect');
      sendMsg({ cmd: 'Login' });
    });

    context.socket.on('message', (body) => {
      const { id: login_user_id } = context.state.userInfo || {};
      const { chatSelectUserId } = context.state;
      // console.log('body:', JSON.stringify(body));
      switch (body.cmd) {
        case 'unReadStati':
          setUnreadMap(body.data);
          context.state.unReadMap = body.data;
          sendMsg({ cmd: 'MsgList', select_user_id: uid });
          break;
        case 'MsgList':
          const tmp1 = context.state.userMsgMap || {};
          tmp1[chatSelectUserId] = body.list;
          setUserMsgMap(tmp1);
          context.onSaveUserMsgMap(tmp1);
          setUserMsgMap({ ...context.state.userMsgMap });
          if (chatWinBodyRef && chatWinBodyRef.current) {
            chatWinBodyRef.current.scrollTop += 100000;
          }
          break;
        case 'Msg':
          const tmp = context.state.userMsgMap || {};
          const { user_id, to_user_id } = body.data;
          if (login_user_id === to_user_id) {
            // Message received
            if (user_id !== chatSelectUserId) {
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
          if (chatWinBodyRef && chatWinBodyRef.current) {
            chatWinBodyRef.current.scrollTop += 1000000;
          }
          break;
        default:
      }
    });

    sendMsg({ cmd: 'Login' });
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
  const sendMsg = async (data) => {
    if (context.socket.disconnected) {
      context.socket.connect();
      await Util.await(1500);
      sendMsg(data);
      return;
    }
    // data.token = HttpHelper.token;
    const { id: user_id } = context.userInfo || context.state.userInfo || {};
    if (!user_id) {
      return;
    }
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
    // clear unread count
    unReadMap[item.id] = null;
    sendMsg({ cmd: 'MsgList', select_user_id: item.id });
  };

  const { id: user_id } = context.state.userInfo || {};
  return (
    <div>
      <GoBack />

      <div className="row text-white">
        {/* <div className="col1 " style={{ border: '1px solid #f0f0f0', marginRight: '5px ', minWidth: '190px' }}> */}
        <div className="col1 " style={{ border: '1px solid #999999', marginRight: '5px ', minWidth: '190px' }}>
          <h5 className="text-center text-white">I Want you list</h5>
          {chatList &&
            chatList.map((item, index) => {
              return (
                // <div key={index} className="row margin-bottom-5 handle" style={{ background: uid === item.id ? '#f0f0f0' : '' }} onClick={() => handleMsgList(item)}>
                <div key={index} className={`row margin-bottom-5 handle ${uid === item.id ? 'bg-info' : ''}`} onClick={() => handleMsgList(item)}>
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
            {userMsgMap[uid] && userMsgMap[uid].length > 0 ? (
              userMsgMap[uid].map((item, index) => {
                return (
                  <div key={index}>
                    {user_id !== item.user_id && (
                      <div className="row">
                        <div className="chat-avatar margin-right-10">
                          <MyImage avatar={item.avatar} />
                        </div>
                        <div className="chat-center">
                          <div>{Util.format(item.create_time, 'yyyy-mm-dd HH:MM:ss.S')}</div>
                          <div className=" bg-dark chat-msg">{item.msg}</div>
                        </div>
                        <div className="col1"></div>
                      </div>
                    )}

                    {user_id !== item.to_user_id && (
                      <div className="row">
                        <div className="col1"></div>
                        <div className="chat-center">
                          <div className="text-right">{Util.format(item.create_time, 'yyyy-mm-dd HH:MM:ss.S')}</div>
                          <div className=" bg-dark chat-msg">{item.msg}</div>
                        </div>
                        <div className="chat-avatar margin-left-10">
                          <MyImage avatar={item.avatar} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="row">
                <div className="col1"></div>
                <div className="col0 text-center font-size-20  bg-dark " style={{ padding: '5px 20px', borderRadius: '5px' }}>
                  No chat record
                </div>
                <div className="col1"></div>
              </div>
            )}
          </div>
          {/* <div className="row padding-0" style={{ border: '1px solid #f0f0f0' }}> */}
          <div className="row padding-0" style={{ border: '1px solid #999999' }}>
            <input className="col1 bg-dark " value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button className="btn btn-dark" onClick={handleSocket} style={{ width: '100px' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
