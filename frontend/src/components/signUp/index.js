import React, { useState, useContext } from 'react';
import 'firebase/auth';
import InputItem from '../../components/InputItem/InputItem';
import { UserContext } from '../../contexts/userContext';
import SubLogo from '../subLogo/subLogo';

const image3 = require('../../images/login-03.png');

const Signup = (props) => {
  // User State
  const [user, setUser] = useState({ username: '', email: '', password: '', error: '' });
  const [error, setError] = useState('');

  // onChange function
  const handleChange = (e) => {
    user[e.fieldName] = e.value;
    setUser({ ...user });
  };

  const context = useContext(UserContext);

  // Submit function (Create account)
  const handleSubmit = async (e) => {
    await context.signUp(user);

    if (context.state.error) {
      setError(context.state.error);
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  return (
    <div className="loginCss ">
      <SubLogo />
      <div className="g-center">
        <div style={{ marginTop: '50px', border: '1px solid #f0f0f0', padding: ' 20px 80px' }}>
          <h1 className="text-center">
            <img src={image3} width="80%" alt="" />
          </h1>
          <InputItem name="Username" fieldName="username" onChange={handleChange} />
          <InputItem name="Password" type="password" fieldName="password" onChange={handleChange} />
          <InputItem name="Email" fieldName="email" onChange={handleChange} />

          <button style={{ marginLeft: '120px' }} className="btn btn-light" onClick={handleSubmit}>
            SignUp
          </button>
          <button type="submit" style={{ marginLeft: '10px' }} className="btn btn-light" onClick={() => props.history.push('/login')}>
            Log in
          </button>
          {error && <h4>{error}</h4>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
