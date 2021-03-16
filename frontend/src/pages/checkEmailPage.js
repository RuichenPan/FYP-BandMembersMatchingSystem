import React, { useEffect, useContext, useState } from 'react';
import SubLogo from '../components/subLogo/subLogo';

import { UserContext } from '../contexts/userContext';
import Util from '../util';

const CheckEmailPage = (props) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const context = useContext(UserContext);
  const state = context.state;

  useEffect(() => {
    const callApi = async () => {
      const { search } = props.history.location;
      const data = Util.parseQuery(search);
      setEmail(data.email);
      await context.checkEmail(data);
      setMsg('Email activation successfully');
    };
    callApi();
  }, [state.checkEmail]);

  return (
    <div className="container">
      <SubLogo />
      <div className="g-center">{email}</div>
      Email Check Page
      <div>{msg}</div>
    </div>
  );
};

export default CheckEmailPage;
