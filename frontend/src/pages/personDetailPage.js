import React, { useContext, useEffect, useState } from 'react';
import MyImage from '../components/MyImage/MyImage';
import GoBack from '../components/GoBack/GoBack';
import Comment from '../components/Comment/Comment';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const PersonDetailPage = (props) => {
  const context = useContext(UserContext);
  const [info, setInfo] = useState({});

  
  useEffect(() => {
    const apiCall = async () => {
      const parasm = Util.parseQuery();
      const { id: user_id } = parasm;
      await context.onGetPersonDetail(user_id);
      setInfo(context.state.personDetail);
    };
    apiCall();
    // eslint-disable-next-line
  }, [context]);

  const { username, avatar } = info;

  return (
    <div className="person-detail-body">
      <GoBack />
      <div className="row">
        <div className="person-portrait">
          <MyImage avatar={avatar} />
          <div className="row margin-top-10 text-center">
            <div className="col1 ">
              <span className="btn btn-dark" onClick={() => context.switchPage(`album`, { id: info.id })}>
                Album
              </span>
            </div>
            <div className="col1">
              <span className="btn btn-dark" onClick={() => context.switchPage(`video`, { id: info.id })}>
                Video
              </span>
            </div>
          </div>
        </div>
        <div className="col1 padding-left-10">
          <div className="row margin-bottom-10">
            <div className="person-label">Name:</div>
            <div className="col1">{username}</div>
          </div>
          <div className="row margin-bottom-10">
            <div className="person-label">Gender:</div>
            <div className="col1">{info.gender}</div>
          </div>
          <div className="row margin-bottom-10">
            <div className="person-label">Address:</div>
            <div className="col1 handle" onClick={() => context.switchPage('map', { id: info.id, lat: info.lat || '', lon: info.lon || '' })}>
              <span className="margin-right-10">{info.address}</span>
              <div className=" icon icon-position"></div>
            </div>
          </div>
          <div className="row margin-bottom-10">
            <div className="person-label">Music Style:</div>
            <div className="col1">{info.music_style}</div>
          </div>
          <div className="row margin-bottom-10">
            <div className="person-label">Email:</div>
            <div className="col1">{info.email}</div>
          </div>
          <div className="row margin-bottom-10">
            <div className="person-label">I Am A:</div>
            <div className="col1">{info.i_am_a}</div>
          </div>

          <div className=" margin-bottom-30" desc="Comment">
            <Comment user_id={info.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;
