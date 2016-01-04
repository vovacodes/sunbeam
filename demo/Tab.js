import React from 'react';

const Tab = (props) => {
  const className = (props.isFocused) ? 'tab -focused' : 'tab';

  return (
      <div className={className}>{props.children}</div>
  );
};

export default Tab;
