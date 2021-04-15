import React from 'react';
import './InputItem.css';

const InputItem = ({ maxlength, onChange, name, fieldName, type = 'text' }) => {
  return (
    <div>
      <div className="input-group mb-3 bg-dark">
        <div className="input-group-prepend  bg-dark">
          <span className="input-group-text bg-dark text-white" style={{ border: 'unset' }}>
            {name}
          </span>
        </div>
        <input
          type={type}
          placeholder={`Please enter ${name}`}
          name="username"
          style={{ backgroundColor: '#ffffff', color: '#000' }}
          maxLength={maxlength || 30}
          onChange={(e) => {
            onChange({ fieldName, value: e.target.value });
          }}
        />
      </div>
    </div>
  );
};

export default InputItem;
