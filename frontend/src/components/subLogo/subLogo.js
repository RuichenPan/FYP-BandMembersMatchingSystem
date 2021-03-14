import React from 'react';
const image1 = require('../../images/login-01.png');
const image2 = require('../../images/login-02.png');

const SubLogo = () => {
  return (
    <div className="row">
      <div className="col-2">
        <img src={image1} width="80%" alt="" />
      </div>
      <div className="col-1"></div>
      <div className="col-8">
        <img src={image2} width="80%" alt="" />
      </div>
    </div>
  );
};

export default SubLogo;