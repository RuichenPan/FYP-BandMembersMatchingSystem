import React, { useContext, useEffect, useState } from 'react';
import Image from '../components/Image/image';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const PersonDetailPage = (props) => {
  const context = useContext(UserContext);
  const [, setTimes] = useState(0);
  const [info, setInfo] = useState({});

  const initDetail = async () => {
    const parasm = Util.parseQuery(props.history.location.search);
    const { id: user_id } = parasm;
    await context.onGetPersonDetail(user_id);

    setInfo(context.state.personDetail);
    console.log(parasm);
  };
  useEffect(() => {
    initDetail();
  }, [context]);
  const { username, address, avatar } = info;
  console.log('username:', username);
  return (
    <div className="person-detail-body">
      <div className="row">
        <div className="col1"></div>
        <div className="col0 btn btn-light" onClick={context.goBack}>
          Back
        </div>
      </div>
      <div className="row">
        <div className="person-portrait">
          <Image avatar={avatar} />
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
            <div className="col1">
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
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;
