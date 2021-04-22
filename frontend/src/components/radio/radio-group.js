import React from 'react';
import './radio.css';

const RadioGroup = (props) => {
  return (
    <div className={props.row ? 'row' : ''}>
      {React.Children.map(props.children, (child) => {
        let isActive = props.active === child.props.value ? true : false;
        return React.cloneElement(child, {
          label: child.props.children,
          value: child.props.value,
          active: child.props.active || isActive,
          onClick: (val) => (child.props.onClick && child.props.onClick(val)) || (props.onChange && props.onChange(val)),
        });
      })}
    </div>
  );
};

export default RadioGroup;
