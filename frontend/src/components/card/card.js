import React, { useContext, useState } from 'react';
import './card.css';
import defaultAvatar from '../../images/default-avatar.jpg';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';
import Image from '../Image/image';

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

  const handleFavorites = async () => {
    console.log('handleAddFavorites:');
    const { onUpdate, collection, info } = props;
    if (collection) {
      await context.onDeleteFavorites(info.id);
      context.alertMsg('delete success');
    } else {
      await context.onAddFavorites(info.id);
      context.alertMsg('add success');
    }
    setTimes(Date.now());
    onUpdate && onUpdate();
  };
  const { id, avatar } = props.info || {};
  let avatar_url = avatar ? `${httpHelper.WebSite}/uploads/${avatar}` : defaultAvatar;
  console.log('avatar_url:', avatar_url, 'avatar:', !avatar);

  return (
    <div className="card-info">
      <div className="row border-color-f0 text-nowrap padding-5 margin-top-10">
        <div className="col1 ">
          <span className="handle" onClick={() => context.switchPage(`/person?id=${id}`)}>
            {props.info.username}
          </span>
        </div>

        <div className="col0 margin-right-10" onClick={handleFavorites}>
          <div className={`handle icon icon-collection${props.collection ? '-select' : ''}`} />
        </div>

        <div className="col0 ">
          <div className="icon icon-position handle"></div>
        </div>
      </div>
      <div>
        <div className="profile-image">
          <Image avatar={avatar} />
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
