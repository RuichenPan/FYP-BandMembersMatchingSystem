import React, { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';

const GoBack = (props) => {
  const context = useContext(UserContext);
  return (
    <div className="row">
      <div className="col1"></div>
      <div className="col0 btn btn-light" onClick={context.goBack}>
        Back
      </div>
    </div>
  );
};

export default GoBack;
