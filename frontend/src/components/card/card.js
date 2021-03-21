import React, { useContext, useState } from 'react';
import './card.css';
import defaultAvatar from '../../images/default-avatar.jpg';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';

const Card = (props) => {
  const context = useContext(UserContext);
  const [, setTimes] = useState(0);
  const handleVideo = () => {
    console.log('video');
  };
  const handleInformation = () => {
    console.log('handleInformation');
  };
  const handleChat = () => {
    console.log('handleChat');
  };

  const handleAddFavorites = async () => {
    console.log('handleAddFavorites:');
    await context.onAddFavorites(props.info.id);
    context.alertMsg('add success');
    setTimes(Date.now());
  };
  const { avatar } = props.info || {};
  let avatar_url = avatar ? `${httpHelper.WebSite}/uploads/${avatar}` : defaultAvatar;
  console.log('avatar_url:', avatar_url, 'avatar:', !avatar);

  return (
    <div className="card-info">
      <div className="row">
        <div className="col4 row text-center border-color-f0 text-nowrap padding-5 margin-top-10">
          <div className="col1 ">
            <span className="handle" onClick={handleAddFavorites}>
              I Want You
            </span>
          </div>
          <div className="col1 ">
            <span className="handle">Maps</span>
          </div>
        </div>
      </div>
      <div>
        <div className="profile-image">
          <div className="img img-cover" style={{ backgroundImage: `url('${avatar_url}')` }}></div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col1 margin-5 btn btn-light" onClick={handleInformation}>
          Info
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
