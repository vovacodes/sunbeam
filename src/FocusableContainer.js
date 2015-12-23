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

  // =============== focusStrategy methods =====================

  getPreferredFocusable() {
    return this.props.focusStrategy.getPreferredFocusable();
  }

  moveFocusUp() {
    return this.props.focusStrategy.moveFocusUp();
  }

  moveFocusRight() {
    return this.props.focusStrategy.moveFocusRight();
  }

  moveFocusDown() {
    return this.props.focusStrategy.moveFocusDown();
  }

  moveFocusLeft() {
    return this.props.focusStrategy.moveFocusLeft();
  }

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
  children: React.PropTypes.element,
  focusStrategy: React.PropTypes.shape({
    getPreferredFocusable: React.PropTypes.func,
    moveFocusUp: React.PropTypes.func,
    moveFocusDown: React.PropTypes.func,
    moveFocusLeft: React.PropTypes.func,
    moveFocusRight: React.PropTypes.func
  })
};

export default FocusableContainer;
