import React, { useContext, useState } from 'react';
import './card.css';
import { UserContext } from '../../contexts/userContext';
import MyImage from '../MyImage/MyImage';

const Card = (props) => {
  const context = useContext(UserContext);
  const [, setTimes] = useState(0);

  const handleFavorites = async () => {
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
  const { id, avatar, lat, lon } = props.info || {};

  return (
    <div className="card-info" style={{ ...(props.style || {}) }}>
      <div className="card-body">
        <div className="profile-image">
          <MyImage avatar={avatar} />
        </div>

        <div className="row text-nowrap padding-5 ">
          <div className="col1 text-center ">
            <div className="row align-center">
              <div className="col1"></div>
              <div className="col0 handle" onClick={() => context.switchPage(`/person?id=${id}`)}>
                {props.info.username}
              </div>
              <div className="col0 margin-top-10">
                <div className={`handle margin-left-5 icon icon-collection${props.collection ? '-select' : ''}`} onClick={handleFavorites} />
              </div>
              <div className="col1"></div>
            </div>
          </div>

          <div className="col0  margin-top-10">
            <div className="icon icon-position handle" onClick={() => context.switchPage(`/map?id=${id}&lat=${lat || ''}&lon=${lon || ''}`)}></div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col1 margin-5 btn btn-dark" onClick={() => context.switchPage(`/album?id=${id}`)}>
            Album
          </div>
          <div className="col1 margin-5 btn btn-dark" onClick={() => context.switchPage(`/video?id=${id}`)}>
            Video
          </div>
          {!props.hideChat && (
            <div className="col1 margin-5 btn btn-dark" onClick={() => context.switchPage(`/chat?id=${id}`)}>
              Chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
