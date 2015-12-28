import React from 'react';
import FocusManager from './FocusManager';

class Focusable extends React.Component {
  constructor(props) {
    super(props);
    // create a storage for all Focusable-related props
    this._focusable = {};
  }

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
