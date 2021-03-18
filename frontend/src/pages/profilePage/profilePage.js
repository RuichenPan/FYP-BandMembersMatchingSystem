import React, { useContext, useState, useEffect } from 'react';
import HttpHelper from '../../api/httpHelper';
import SubLogo from '../../components/subLogo/subLogo';
import { UserContext } from '../../contexts/userContext';

const PorfilePage = (props) => {
  const context = useContext(UserContext);
  const [times, setTimes] = useState(0);
  const [msg, setMsg] = useState('');

  const sendData = (data) => {
    console.log(data);
    context.socket.send(data);
  };

  const update = () => {
    const t = times + 1;
    setTimes(t);
  };

  useEffect(() => {
    // get config info
    const api = async () => {
      await context.getConfigInfo();
      update();
      context.socket.auth.token = HttpHelper.token;
      context.socket.disconnect().connect();
      context.socket.on('msg', (data) => {
        console.log('data:', data);
      });
    };
    api();
  }, [context]);

  const handleSocket = () => {
    sendData({ msg });
  };

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
    <div className="container">
      <SubLogo />
      <div className="row">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={handleSocket}>connect</button>
      </div>
      <div className="row">
        <div className="col-3">
          <div className="row">
            <div className="col4 row text-center border-color-f0 text-nowrap padding-5 margin-top-10">
              <div className="col1 ">
                <span className="handle" onClick={() => context.switchPage('/')}>
                  Square
                </span>
              </div>
              <div className="col1 ">
                <span className="handle" onClick={() => context.onFavorites()}>
                  I Want You
                </span>
              </div>
              <div className="col1 ">
                <span className="handle">Maps</span>
              </div>
            </div>
          </div>
          <div>
            <div>Image</div>
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
        <div className="col-9">bb</div>
      </div>
    </div>
  );
};

export default PorfilePage;
