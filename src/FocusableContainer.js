import React from 'react';
import FocusManager from './FocusManager';

class FocusableContainer extends React.Component {
  componentWillMount() {
    FocusManager.registerFocusable(this);
  }

  componentWillUnmount() {
    FocusManager.deregisterFocusable(this);
  }

  render() {
    return null;
  }
}

export default FocusableContainer;
