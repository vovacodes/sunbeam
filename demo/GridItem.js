import React from 'react';

const GridItem = (props) => {
  const { isFocused, children } = props;
  let className = 'grid-item';
  if (isFocused) {
    className += ' -focused';
  }

  return (
      <td className={className}>{children}</td>
  );
};

export default GridItem;
