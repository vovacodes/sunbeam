import invariant from 'invariant';
import matchesProperty from 'lodash.matchesproperty';
import {
  getFocused,
  findFocusableNode,
  forEachUpTheTree,
  findLowestCommonAncestor,
  addFocusableChild,
  removeFocusableFromTree,
  getParent
} from './utils/FocusableTreeUtils';
import { getStrategy } from './utils/StrategyUtils';

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

  setFocusTarget(newFocusTarget) {
    if (typeof newFocusTarget === 'string') {
      newFocusTarget = findFocusableNode(focusTree.root, matchesProperty('props.id', newFocusTarget));
    }

    newFocusTarget = recursivelyGetPreferredFocusable(newFocusTarget);

    notifyUpdatedSubtreesAboutFocusChange(focusTree.focusTarget, newFocusTarget);
    focusTree.focusTarget = newFocusTarget;
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
    forEachUpTheTree(focusTree.focusTarget, selectNode);
  }

};

function selectNode(node) {
  node.componentWillSelect && node.componentWillSelect();
  node.props.onSelect && node.props.onSelect();
  node.props.componentDidSelect && node.componentDidSelect();
}

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

  notifyUpdatedSubtreesAboutFocusChange(focusTarget, nextFocusTargetCandidate);

  focusTree.focusTarget = nextFocusTargetCandidate;
}

function recursivelyGetPreferredFocusable(node) {
  const strategy = getStrategy(node);

  if (strategy) {
    const preferredFocusable = strategy.getPreferredFocusable(node);

    if (preferredFocusable) {
      return recursivelyGetPreferredFocusable(preferredFocusable);
    } else {
      return node;
    }
  }
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

  var strategy = getStrategy(parentFocusable);

  switch (direction) {
    case FOCUS_DIRECTION_UP:
      nextFocusTarget = strategy.getUpFocusable(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_DOWN:
      nextFocusTarget = strategy.getDownFocusable(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_LEFT:
      nextFocusTarget = strategy.getLeftFocusable(parentFocusable, currentFocusTarget);
      break;
    case FOCUS_DIRECTION_RIGHT:
      nextFocusTarget = strategy.getRightFocusable(parentFocusable, currentFocusTarget);
      break;
  }

  if (nextFocusTarget === null) {
    return getNextFocusTargetWithinTheSameContainer(parentFocusable, currentFocusTarget, direction);
  }

  return nextFocusTarget;
}

function notifyUpdatedSubtreesAboutFocusChange(focusTarget, nextFocusTargetCandidate) {
  const lowestCommonAncestor = findLowestCommonAncestor(focusTarget, nextFocusTargetCandidate);

  forEachUpTheTree(focusTarget, (focusable) => {
    if (focusable === lowestCommonAncestor) return false;

    notifyFocusableAboutLosingFocus(focusable);
  });

  forEachUpTheTree(nextFocusTargetCandidate, (focusable) => {
    if (focusable === lowestCommonAncestor) return false;

    notifyFocusableAboutReceivingFocus(focusable);
  });
}

function notifyFocusableAboutReceivingFocus(focusable) {
  focusable.props.onFocus && focusable.props.onFocus();
  focusable.componentDidReceiveFocus();
}

function notifyFocusableAboutLosingFocus(focusable) {
  focusable.props.onBlur && focusable.props.onBlur();
  focusable.componentDidLoseFocus();
}
