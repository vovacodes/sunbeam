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

  getPreferredFocusable(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.getPreferredFocusable(focusableContainer, previousFocusTarget);
  }

  moveFocusUp(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusUp(focusableContainer, previousFocusTarget);
  }

  moveFocusRight(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusRight(focusableContainer, previousFocusTarget);
  }

  moveFocusDown(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusDown(focusableContainer, previousFocusTarget);
  }

  moveFocusLeft(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusLeft(focusableContainer, previousFocusTarget);
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
    moveFocusUp: React.PropTypes.func,
    moveFocusDown: React.PropTypes.func,
    moveFocusLeft: React.PropTypes.func,
    moveFocusRight: React.PropTypes.func
  })
};

export default FocusableContainer;
