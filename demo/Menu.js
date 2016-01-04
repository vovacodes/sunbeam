import React from 'react';
import MenuItem from './MenuItem';
import Focusable from '../src/Focusable';

export default class Menu extends React.Component {
  render() {
    const { menuData, activeItemId, onMenuItemFocused } = this.props;
    const menuItems = menuData.map(({ text, id }) => {
      return (
          <Focusable key={id} onFocus={() => onMenuItemFocused(id)}>
            <MenuItem isFocused={id === activeItemId}>{text}</MenuItem>
          </Focusable>
      );
    });

    return (
        <div className="menu">{menuItems}</div>
    );
  }
}
