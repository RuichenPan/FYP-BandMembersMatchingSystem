import React, { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import './footer.css';

const Footer = (props) => {
  const context = useContext(UserContext);
  return (
    <div className="footerCss bg-dark ">
      <div className="container ">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4 text-center">&copy;CopyRight 2021</div>
          <div className="col-4"></div>
        </div>
        <div className="row">
          <div className="col-4 handle" onClick={() => context.switchPage('/')}>
            Square
          </div>
          <div className="col-4 handle" onClick={() => context.switchPage('/favorites')}>
            I Want You
          </div>
          <div className="col-4 handle" onClick={() => context.switchPage('/profile')}>
            Profile 
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
