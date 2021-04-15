import React, { useState, useContext } from 'react';
import './index.css';
import InputItem from '../../components/InputItem/InputItem';
import { UserContext } from '../../contexts/userContext';

// const image3 = require('../../images/login-03.png');

const Login = (props) => {
  // User State
  const [user, setUser] = useState({ username: '', password: '', error: '' });
  const [error, setError] = useState('');

  // onChange function
  const handleChange = (e) => {
    user[e.fieldName] = e.value;
    setUser({ ...user });
  };

  const context = useContext(UserContext);

  // Submit function (Log in user)
  const handleSubmit = async (e) => {
    await context.signIn(user);
    const { state } = context;

    if (state.error) {
      setError(state.error);
      setTimeout(() => {
        setError('');
      }, 2000);

      return;
    }
  };

  return (
    <div className="loginCss ">
      <div className="g-center">
        <div className="LogBody bg-dark">
          <h1 className="text-center hurricane">
            {/* <img src={image3} width="80%" alt="" /> */}
            HURRICANE
          </h1>
          <InputItem name="username" fieldName="username" onChange={handleChange} />
          <InputItem name="password" fieldName="password" type="password" onChange={handleChange} />
          <button type="submit" style={{ marginLeft: '100px' }} className="btn btn-danger" onClick={handleSubmit}>
            Log in
          </button>
          <button
            style={{ marginLeft: '10px' }}
            className="btn btn-danger"
            onClick={() => {
              props.history.push('/signup');
            }}
          >
            SignUp
          </button>
          {error && <h4>{error}</h4>}
        </div>
      </div>
    </div>
  );
};

export default Login;
