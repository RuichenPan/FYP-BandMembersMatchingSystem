import React, { useContext, useEffect, useState } from 'react';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';
import Util from '../../util';
import './siteHeader.css';
import { Button, notification } from 'antd';

const ItemRow = ({ title, onClick }) => {
  return (
    <button className="btn btn-dark" onClick={onClick}>
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
    setUserInfo(null);
    // context.alertMsg('Logout success');
  };

  const showMsg = (data) => {
    const { username, user_id } = data;
    const not_key = `open_${Date.now()}`;
    notification.open({
      key: not_key,
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
          View
        </Button>
      ),
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
    <div className="fixed-top1 headerCss ">
      <div className="container1">
        <div className="row align-center">
          <div>
            <div className="logo"></div>
          </div>
          <div className="col1">
            <div className="row margin-right-30">
              <div className="col1 text-center font-size-24">HURRICANE - Band Members Matching System</div>
              <ItemRow title="Square" onClick={() => context.switchPage('/')} />
              {userInfo && (
                <>
                  <ItemRow title="I Want You" onClick={() => context.switchPage('favorites')} />
                </>
              )}

              {userInfo ? (
                <>
                  <ItemRow title={`Welcome ${userInfo.username}`} onClick={() => context.switchPage('profile')} />
                  <ItemRow title="Logout" onClick={() => handleClick()} />
                </>
              ) : (
                <>
                  <ItemRow title="Login" onClick={() => context.switchPage('login')} />
                  <ItemRow title="Sign Up" onClick={() => context.switchPage('signup')} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
