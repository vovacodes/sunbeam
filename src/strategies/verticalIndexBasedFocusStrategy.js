import { getChildren } from '../utils/FocusableTreeUtils';
import { getSubsequentFocusableChild, getPrecedingFocusableChild } from '../utils/IndexBasedStartegyUtils';

export default {
  getPreferredFocusable(focusableContainer, previousFocusTarget) {
    const focusableChildren = getChildren(focusableContainer);

    return focusableChildren[0];
  },

  moveFocusUp: getPrecedingFocusableChild,

  moveFocusDown: getSubsequentFocusableChild,

  moveFocusRight(focusableContainer, previousFocusTarget) {
    return null;
  },

  moveFocusLeft(focusableContainer, previousFocusTarget) {
    return null;
  }
};
