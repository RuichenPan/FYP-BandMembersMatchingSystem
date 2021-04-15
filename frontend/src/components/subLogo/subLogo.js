import React from 'react';
import './subLogo.css';
// const image1 = require('../../images/login-01.png');
// const image2 = require('../../images/login-02.png');

const SubLogo = () => {
  return (
    <div className="row sublogoCss ">
      <div className="col-2 hurricane">
        {/* <img src={image1} width="80%" alt="" /> */}
        HURRICANE
      </div>
      <div className="col-2"></div>
      <div className="col-8">
        <div className="once">Once I heard rocks,</div>
        <div className="text-right about">all of a sudden I understood what life was about</div>
        {/* <img src={image2} width="80%" alt="" /> */}
      </div>
    </div>
  );
};

export default SubLogo;
