'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash.matchesproperty');

var _lodash2 = _interopRequireDefault(_lodash);

var _FocusableTreeUtils = require('./utils/FocusableTreeUtils');

var _StrategyUtils = require('./utils/StrategyUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOCUS_DIRECTION_UP = 'UP';
var FOCUS_DIRECTION_DOWN = 'DOWN';
var FOCUS_DIRECTION_LEFT = 'LEFT';
var FOCUS_DIRECTION_RIGHT = 'RIGHT';
var focusTree = {};

exports.default = {

  // provide read-only access to focusTree for debugging and testing purposes only
  get _focusTree() {
    return focusTree;
  },

  setFocusTarget: function setFocusTarget(newFocusTarget) {
    if (typeof newFocusTarget === 'string') {
      newFocusTarget = (0, _FocusableTreeUtils.findFocusableNode)(focusTree.root, (0, _lodash2.default)('props.id', newFocusTarget));
    }

    newFocusTarget = recursivelyGetPreferredFocusable(newFocusTarget);

    notifyUpdatedSubtreesAboutFocusChange(focusTree.focusTarget, newFocusTarget);
    focusTree.focusTarget = newFocusTarget;
  },
  initializeFocus: function initializeFocus() {
    var root = focusTree.root;

    if (!root) {
      return;
    }

    var preferredFocusable = recursivelyGetPreferredFocusable(root);

    (0, _FocusableTreeUtils.forEachUpTheTree)(preferredFocusable, notifyFocusableAboutReceivingFocus);

    focusTree.focusTarget = preferredFocusable;
  },
  registerFocusable: function registerFocusable(focusable, parentFocusableId) {
    var isTreeEmpty = !focusTree.root;

    (0, _invariant2.default)(parentFocusableId || isTreeEmpty, '"parentFocusableId" is not provided, but root component in the tree is already defined');

    if (isTreeEmpty) {
      focusTree.root = focusable;
      return;
    }

    var parentFocusable = (0, _FocusableTreeUtils.findFocusableNode)(focusTree.root, (0, _lodash2.default)('_focusable.focusableId', parentFocusableId));

    (0, _invariant2.default)(parentFocusable, 'there is no focusableContainer with focusableId: ' + parentFocusableId);

    (0, _FocusableTreeUtils.addFocusableChild)(parentFocusable, focusable);
  },
  deregisterFocusable: function deregisterFocusable(focusable) {
    (0, _FocusableTreeUtils.removeFocusableFromTree)(focusable);
  },
  doUp: function doUp() {
    doDirection(FOCUS_DIRECTION_UP);
  },
  doRight: function doRight() {
    doDirection(FOCUS_DIRECTION_RIGHT);
  },
  doDown: function doDown() {
    doDirection(FOCUS_DIRECTION_DOWN);
  },
  doLeft: function doLeft() {
    doDirection(FOCUS_DIRECTION_LEFT);
  },
  doSelect: function doSelect() {
    (0, _FocusableTreeUtils.forEachUpTheTree)(focusTree.focusTarget, selectNode);
  }
};

function selectNode(node) {
  node.componentWillSelect && node.componentWillSelect();
  node.props.onSelect && node.props.onSelect();
  node.props.componentDidSelect && node.componentDidSelect();
}

function doDirection(direction) {
  var focusTarget = focusTree.focusTarget;

  if (!focusTarget) {
    return;
  }

  var nextFocusTargetCandidate = recursivelyGetNextFocusTarget(focusTarget, direction);

  // nextFocusTargetCandidate could be a container itself, so we should ask it for a getPreferredFocusable
  nextFocusTargetCandidate = recursivelyGetPreferredFocusable(nextFocusTargetCandidate);

  if (nextFocusTargetCandidate === focusTarget) {
    return;
  }

  notifyUpdatedSubtreesAboutFocusChange(focusTarget, nextFocusTargetCandidate);

  focusTree.focusTarget = nextFocusTargetCandidate;
}

function recursivelyGetPreferredFocusable(node) {
  var strategy = (0, _StrategyUtils.getStrategy)(node);

  if (strategy) {
    var preferredFocusable = strategy.getPreferredFocusable(node);

    if (preferredFocusable) {
      return recursivelyGetPreferredFocusable(preferredFocusable);
    } else {
      return node;
    }
  }
}

function recursivelyGetNextFocusTarget(currentFocusTarget, direction) {
  (0, _invariant2.default)(direction, '"direction" is not provided');

  return getNextFocusTargetWithinTheSameContainer(currentFocusTarget, currentFocusTarget, direction);
}

function getNextFocusTargetWithinTheSameContainer(focusableNode, currentFocusTarget, direction) {
  var parentFocusable = (0, _FocusableTreeUtils.getParent)(focusableNode);

  if (!parentFocusable) {
    return currentFocusTarget;
  }

  var nextFocusTarget = undefined;

  var strategy = (0, _StrategyUtils.getStrategy)(parentFocusable);

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
  var lowestCommonAncestor = (0, _FocusableTreeUtils.findLowestCommonAncestor)(focusTarget, nextFocusTargetCandidate);

  (0, _FocusableTreeUtils.forEachUpTheTree)(focusTarget, function (focusable) {
    if (focusable === lowestCommonAncestor) return false;

    notifyFocusableAboutLosingFocus(focusable);
  });

  (0, _FocusableTreeUtils.forEachUpTheTree)(nextFocusTargetCandidate, function (focusable) {
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