import React from 'react';
import FocusManager from './FocusManager';

class Focusable extends React.Component {
  componentWillMount() {
    FocusManager.registerFocusable(this, this.context.parentFocusableId);
  }

  componentWillUnmount() {
    FocusManager.deregisterFocusable(this);
  }

  render() {
    return (
      <span>
        {this.props.children}
      </span>
    );
  }
}

Focusable.propTypes = {
  children: React.PropTypes.element
};
Focusable.contextTypes = {
  parentFocusableId: React.PropTypes.string
};

export default Focusable;
