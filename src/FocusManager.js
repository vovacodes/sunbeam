import invariant from 'invariant';
import matchesProperty from 'lodash.matchesproperty';
import {
    findFocusableNode,
    forEachUpTheTree,
    addFocusableChild,
    removeFocusableFromTree,
    getParent
} from './utils/FocusableTreeUtils';

const FOCUS_DIRECTION_UP = 'UP';
const FOCUS_DIRECTION_DOWN = 'DOWN';
const FOCUS_DIRECTION_LEFT = 'LEFT';
const FOCUS_DIRECTION_RIGHT = 'RIGHT';

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

    forEachUpTheTree(preferredFocusable, notifyFocusableAboutReceivingFocus);

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
    doDirection(FOCUS_DIRECTION_UP);
  },

  doRight() {
    doDirection(FOCUS_DIRECTION_RIGHT);
  },

  doDown() {
    doDirection(FOCUS_DIRECTION_DOWN);
  },

  doLeft() {
    doDirection(FOCUS_DIRECTION_LEFT);
  },

  doSelect() {
  }

};

function doDirection(direction) {
  const { focusTarget } = focusTree;

  if (!focusTarget) {
    return;
  }

  let nextFocusTargetCandidate = recursivelyGetNextFocusTarget(focusTarget, direction);

  // nextFocusTargetCandidate could be a container itself, so we should ask it for a getPreferredFocusable
  nextFocusTargetCandidate = recursivelyGetPreferredFocusable(nextFocusTargetCandidate);

  if (nextFocusTargetCandidate === focusTarget) {
    return;
  }

  notifyFocusableAboutReceivingFocus(nextFocusTargetCandidate);

  focusTree.focusTarget = nextFocusTargetCandidate;
}

function recursivelyGetPreferredFocusable(node) {
  if (!node.getPreferredFocusable) {
    return node;
  }

  const preferredFocusable = node.getPreferredFocusable(node);

  return recursivelyGetPreferredFocusable(preferredFocusable);
}

function recursivelyGetNextFocusTarget(currentFocusTarget, direction) {
  invariant(direction, '"direction" is not provided');

  return getNextFocusTargetWithinTheSameContainer(currentFocusTarget, currentFocusTarget, direction);
}

function getNextFocusTargetWithinTheSameContainer(focusableNode, currentFocusTarget, direction) {
  const parentFocusable = getParent(focusableNode);

  if (!parentFocusable) {
    return currentFocusTarget;
  }

  let nextFocusTarget;
  switch (direction) {
    case FOCUS_DIRECTION_UP:
      nextFocusTarget = parentFocusable.moveFocusUp(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_DOWN:
      nextFocusTarget = parentFocusable.moveFocusDown(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_LEFT:
      nextFocusTarget = parentFocusable.moveFocusLeft(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_RIGHT:
      nextFocusTarget = parentFocusable.moveFocusRight(parentFocusable, currentFocusTarget);
      break;
  }

  if (nextFocusTarget === null) {
    return getNextFocusTargetWithinTheSameContainer(parentFocusable, currentFocusTarget, direction);
  }

  return nextFocusTarget;
}

function notifyFocusableAboutReceivingFocus(focusable) {
  focusable.props.onFocus && focusable.props.onFocus();
  focusable.componentDidReceiveFocus();
}
