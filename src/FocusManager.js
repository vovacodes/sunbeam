import invariant from 'invariant';
import matchesProperty from 'lodash.matchesproperty';
import { findFocusableNode, forEachUpTheTree, addFocusableChild, removeFocusableFromTree } from './utils/FocusableTreeUtils';

const focusTree = {};

export default {

  // provide read-only access to focusTree for debugging and testing purposes only
  get _focusTree() {
    return focusTree;
  },

  initializeFocus() {
    const { root } = focusTree;

    if (!root) {
      return;
    }

    const preferredFocusable = recursivelyGetPreferredFocusable(root);

    forEachUpTheTree(preferredFocusable, (focusable) => {
      focusable.props.onFocus && focusable.props.onFocus();
      focusable.componentDidReceiveFocus();
    });

    focusTree.focusTarget = preferredFocusable;
  },

  registerFocusable(focusable, parentFocusableId) {
    const isTreeEmpty = !focusTree.root;

    invariant(parentFocusableId || isTreeEmpty, '"parentFocusableId" is not provided, but root component in the tree is already defined');

    if (isTreeEmpty) {
      focusTree.root = focusable;
      return;
    }

    const parentFocusable = findFocusableNode(focusTree.root, matchesProperty('_focusable.focusableId', parentFocusableId));

    invariant(parentFocusable, `there is no focusableContainer with focusableId: ${parentFocusableId}`);

    addFocusableChild(parentFocusable, focusable);
  },

  deregisterFocusable(focusable) {
    removeFocusableFromTree(focusable);
  },

  doUp() {
  },

  doRight() {
  },

  doDown() {
  },

  doLeft() {
  },

  doSelect() {
  }

};

function recursivelyGetPreferredFocusable(node) {
  if (!node.getPreferredFocusable) {
    return node;
  }

  const preferredFocusable = node.getPreferredFocusable(node);

  return recursivelyGetPreferredFocusable(preferredFocusable);
}
