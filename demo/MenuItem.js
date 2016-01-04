import React from 'react';

const MenuItem = (props) => {
  let className = 'item';
  if (props.isFocused) {
    className += ' -focused';
  }
  if (props.isActive) {
    className += ' -active';
  }

  return (
      <div className={className}>{props.children}</div>
  );
};

export default MenuItem;
