import React, { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
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

  // Log out function
  const handleClick = () => {
    context.onLogout();
    alert('Logout！');
  };

  return (
    // bg-dark

    <div className="fixed-top ">
      <div className="container">
        <div className="row">
          <ItemRow title="Home" onClick={() => context.switchPage('/')} />
          <ItemRow title="Login" onClick={() => context.switchPage('login')} />
          <ItemRow title="Sign Up" onClick={() => context.switchPage('signup')} />
          <div className="col1"></div>
          <ItemRow title="Logout" onClick={() => handleClick()} />
          <ItemRow title="Profile" onClick={() => context.switchPage('profile')} />
          <ul className="navbar-nav navbar navbar-light"></ul>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
