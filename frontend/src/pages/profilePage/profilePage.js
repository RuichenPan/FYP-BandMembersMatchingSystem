import React, { useContext, useState, useEffect } from 'react';
import HttpHelper from '../../api/httpHelper';
import Card from '../../components/card/card';
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
      context.getConfigInfo().then(() => {
        update();
      });
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

  console.log('cfg', context.state);
  return (
    <div className="container">
      <SubLogo />
      <div className="row">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={handleSocket}>connect</button>
      </div>
      <div className="row">
        <div className="col-3">
          <Card />
        </div>
        <div className="col-9">bb</div>
      </div>
    </div>
  );
};

export default PorfilePage;
