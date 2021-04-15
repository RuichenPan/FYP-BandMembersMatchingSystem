import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const CheckEmailPage = (props) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const context = useContext(UserContext);

  const { location } = props.history;
  const { search } = location;

  useEffect(() => {
    const callApi = async () => {
      const data = Util.parseQuery(search);
      setEmail(data.email);
      await context.checkEmail(data);
      setMsg('Email activation successfully');
    };
    callApi();
  }, [search, context]);

  return (
    <div className="container">
      <div className="g-center">{email}</div>
      Email Check Page
      <div>{msg}</div>
    </div>
  );
};

export default CheckEmailPage;
