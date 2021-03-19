import React from 'react';
import './radio.css';

const Radio = (props) => {
  return (
    <div className="radio-wrap" onClick={() => props.onClick && props.onClick(props.value)}>
      <div className="left handle">
        <div className={`circle ${props.active === true ? 'active' : ''} `}>
          <div className="fork"></div>
        </div>
        <div className="label">{props.label}</div>
      </div>
    </div>
  );
};

export default Radio;
