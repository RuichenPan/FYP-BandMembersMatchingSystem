import React, { useContext, useEffect, useState } from 'react';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';
import Util from '../../util';
import './siteHeader.css';

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

  useEffect(() => {
    const userInfo = httpHelper.userInfo;
    setUserInfo(userInfo);

    Util.userNofity.subscribe((uInfo) => {
      setUserInfo(uInfo);
      console.log('111');
    });
  }, [context.userInfo]);

  console.log('context.userInfo:', context.userInfo);

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
