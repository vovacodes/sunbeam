import React from 'react';
import uniqueId from 'lodash.uniqueid';
import FocusManager from './FocusManager';

class FocusableContainer extends React.Component {
  constructor(props) {
    super(props);

    // create a storage for all Focusable-related props
    this._focusable = {};

    // assign a unique focusableId to be identifiable inside the FocusManager
    this._focusable.focusableId = uniqueId('FocusableContainer');
  }

  getChildContext() {
    return {
      parentFocusableId: this._focusable.focusableId
    };
  }

  componentWillMount() {
    FocusManager.registerFocusable(this, this.context.parentFocusableId);
  }

  componentWillUnmount() {
    FocusManager.deregisterFocusable(this);
  }

  // =============== focus lifecycle methods =====================

  componentDidReceiveFocus() {}

  componentDidLoseFocus() {}

  render() {
    return (
        <span>
          {this.props.children}
        </span>
    );
  }
}

FocusableContainer.childContextTypes = {
  parentFocusableId: React.PropTypes.string
};
FocusableContainer.contextTypes = {
  parentFocusableId: React.PropTypes.string
};
FocusableContainer.propTypes = {
  children: React.PropTypes.node,
  focusStrategy: React.PropTypes.shape({
    getPreferredFocusable: React.PropTypes.func,
    getUpFocusable: React.PropTypes.func,
    getDownFocusable: React.PropTypes.func,
    getLeftFocusable: React.PropTypes.func,
    getRightFocusable: React.PropTypes.func
  })
};

export default FocusableContainer;
