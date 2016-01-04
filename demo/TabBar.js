import React from 'react';
import Tab from './Tab';
import Focusable from '../src/Focusable';
import FocusableContainer from '../src/FocusableContainer';

export default class TabBar extends FocusableContainer {
  render() {
    const { tabsData, activeTabIndex, onTabFocused } = this.props;
    const tabs = tabsData.map((tabTitle, index) => {
      return (
          <Focusable key={index} onFocus={() => onTabFocused(index)}>
            <Tab isFocused={index === activeTabIndex}>{tabTitle}</Tab>
          </Focusable>
      );
    });

    return (
        <div className="tab-bar">{tabs}</div>
    );
  }
}
