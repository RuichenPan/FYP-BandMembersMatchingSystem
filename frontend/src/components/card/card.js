import React from 'react';
import './card.css';

const Card = (props) => {
  const handleVideo = () => {
    console.log('video');
  };
  const handleInformation = () => {
    console.log('handleInformation');
  };
  const handleChat = () => {
    console.log('handleChat');
  };

  return (
    <div className="card-info">
      <div className="row">
        <div className="col4 row text-center border-color-f0 text-nowrap padding-5 margin-top-10">
          <div className="col1 ">
            <span className="handle" onClick={() => props.switchPage && props.switchPage('/')}>
              Square
            </span>
          </div>
          <div className="col1 ">
            <span className="handle" onClick={() => props.addFavorites && props.addFavorites()}>
              I Want You
            </span>
          </div>
          <div className="col1 ">
            <span className="handle">Maps</span>
          </div>
        </div>
      </div>
      <div>
        <div className="img img-default profile-image"></div>
      </div>
      <div className="row text-center">
        <div className="col1 margin-5 btn btn-light" onClick={handleInformation}>
          Information
        </div>
        <div className="col1 margin-5 btn btn-light" onClick={handleVideo}>
          Video
        </div>
        <div className="col1 margin-5 btn btn-light" onClick={handleChat}>
          Chat
        </div>
      </div>
    </div>
  );
};

export default Card;
