import { getChildren } from '../utils/FocusableTreeUtils';
import { getSubsequentFocusableChild, getPrecedingFocusableChild } from '../utils/IndexBasedStartegyUtils';

export default {
  getPreferredFocusable(focusableContainer, previousFocusTarget) {
    const focusableChildren = getChildren(focusableContainer);

    return focusableChildren[0];
  },

  moveFocusUp(focusableContainer, previousFocusTarget) {
    return null;
  },

  moveFocusDown(focusableContainer, previousFocusTarget) {
    return null;
  },

  moveFocusRight: getSubsequentFocusableChild,

  moveFocusLeft: getPrecedingFocusableChild
};
