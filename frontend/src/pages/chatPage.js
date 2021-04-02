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

  const [uid, setUid] = useState(id);

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
  const sendMsg = (data) => {
    data.token = HttpHelper.token;
    context.socket.send(data);
  };
  useEffect(() => {
    myChatList();

    sendMsg({ cmd: 'Login' });
    context.socket.on('message', (data) => {
      console.log('data:', data);
    });
  }, [context]);

  const handleSocket = () => {
    sendMsg({ cmd: 'Msg', msg, user_id: uid });
    setMsg('');
  };

  return (
    <div>
      <GoBack />

      <div className="row">
        <div className="col1 " style={{ border: '1px solid #f0f0f0', marginRight: '5px ', minWidth: '190px' }}>
          <h5 className="text-center">I Want you list</h5>
          {chatList &&
            chatList.map((item, index) => {
              return (
                <div key={index} className="row margin-bottom-5 handle" style={{ background: uid == item.id ? '#f0f0f0' : '' }} onClick={() => setUid(item.id)}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                    <MyImage avatar={item.avatar} />
                  </div>
                  <div className="margin-left-10">
                    <div className="font-size-20">{item.username}</div>
                    <div className="font-size-16">{item.email}</div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="col4">
          <div className="row">
            <div></div>
          </div>
          <div className="row">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button onClick={handleSocket}>connect</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
