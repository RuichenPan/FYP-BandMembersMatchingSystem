import React from 'react';
import './InputItem.css';

const InputItem = ({ onChange, name, fieldName, type = 'text' }) => {
  return (
    <div>
      <div className="input-group mb-3 dark">
        <div className="input-group-prepend">
          <span className="input-group-text bg-dark text-white">{name}</span>
        </div>
        <input
          type={type}
          placeholder={`Please enter ${name}`}
          name="username"
          onChange={(e) => {
            onChange({ fieldName, value: e.target.value });
          }}
        />
      </div>
    </div>
  );
};

export default InputItem;
