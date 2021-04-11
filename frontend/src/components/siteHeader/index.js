import React, { useContext, useEffect, useState } from 'react';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';
import Util from '../../util';
import './siteHeader.css';
import { Button, notification } from 'antd';
const ItemRow = ({ title, onClick }) => {
  return (
    <button className="btn btn-light" onClick={onClick}>
      {title}
    </button>
  );
};

const SiteHeader = (props) => {
  const context = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({});
  // Log out function
  const handleClick = () => {
    context.onLogout();
    alert('Logout！');
  };

  console.log('context.history:', context.history);


  const showMsg = (data) => {
    const { username, user_id } = data;
    const not_key = `open_${Date.now()}`;
    notification.open({
      // message: 'Message',
      description: `${username} sends you a message`,
      btn: (
        <Button
          size="small"
          onClick={() => {
            console.log('aaa');
            notification.close(not_key);
            const { pathname } = context.history.location;
            if (pathname === '/chat') {
              context.replacePage('/chat?id=' + user_id);
            } else {
              context.switchPage('/chat?id=' + user_id);
            }
          }}
        >
          Look
        </Button>
      ),
      key: not_key,
    });
  };

  useEffect(() => {
    const userInfo = httpHelper.userInfo;
    setUserInfo(userInfo);
    context.onSaveUserInfo(userInfo);

    Util.userNofity.subscribe((uInfo) => {
      setUserInfo(uInfo);
      context.socket.send({ cmd: 'Login', user_id: uInfo.id });
    });

    context.socket.on('msgRemind', (body) => {
      console.log(JSON.stringify(body));
      const { data } = body;
      setTimeout(() => {
        showMsg(data);
      }, 0);
    });
    if (userInfo && userInfo.id) {
      context.socket.send({ cmd: 'Login', user_id: userInfo.id });
    }
    // eslint-disable-next-line
  }, [context]);

  // console.log('context.userInfo:', context.userInfo);

  return (
    // bg-dark
    <div className="fixed-top ">
      <div className="container">
        <div className="row">
          <ItemRow title="Home" onClick={() => context.switchPage('/')} />
          {!userInfo ? (
            <>
              <ItemRow title="Login" onClick={() => context.switchPage('login')} />
              <ItemRow title="Sign Up" onClick={() => context.switchPage('signup')} />
            </>
          ) : (
            <>
              <ItemRow title="I want you" onClick={() => context.switchPage('favorites')} />
            </>
          )}
          <div className="col1"></div>
          {userInfo ? (
            <>
              <div className="btn btn-light">Webclome {userInfo.username}</div>
              <ItemRow title="Logout" onClick={() => handleClick()} />
              <ItemRow title="Profile" onClick={() => context.switchPage('profile')} />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
