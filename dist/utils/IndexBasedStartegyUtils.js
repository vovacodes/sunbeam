'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubsequentFocusableChild = getSubsequentFocusableChild;
exports.getPrecedingFocusableChild = getPrecedingFocusableChild;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash.findindex');

var _lodash2 = _interopRequireDefault(_lodash);

var _FocusableTreeUtils = require('./FocusableTreeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSubsequentFocusableChild(focusableContainer, previousFocusTarget) {
  var focusableChildren = (0, _FocusableTreeUtils.getChildren)(focusableContainer);

  var previousFocusedChildIndex = focusableChildren.indexOf(previousFocusTarget);
  if (previousFocusedChildIndex === -1) {
    // previousFocusTarget is not a direct child of focusableContainer
    // let's find the index of a child that is the ancestor of previousFocusTarget
    previousFocusedChildIndex = (0, _lodash2.default)(focusableChildren, function (focusableChild) {
      return (0, _FocusableTreeUtils.isAncestorOf)(previousFocusTarget, focusableChild);
    });
  }

  (0, _invariant2.default)(previousFocusedChildIndex >= 0, '"previousFocusTarget" is not a descendant of "focusableContainer"');

  var nextFocusTargetIndex = previousFocusedChildIndex + 1;

  if (nextFocusTargetIndex > focusableChildren.length - 1) {
    return null;
  }

  return focusableChildren[nextFocusTargetIndex];
}

function getPrecedingFocusableChild(focusableContainer, previousFocusTarget) {
  var focusableChildren = (0, _FocusableTreeUtils.getChildren)(focusableContainer);

  var previousFocusedChildIndex = focusableChildren.indexOf(previousFocusTarget);
  if (previousFocusedChildIndex === -1) {
    // previousFocusTarget is not a direct child of focusableContainer
    // let's find the index of a child that is the ancestor of previousFocusTarget
    previousFocusedChildIndex = (0, _lodash2.default)(focusableChildren, function (focusableChild) {
      return (0, _FocusableTreeUtils.isAncestorOf)(previousFocusTarget, focusableChild);
    });
  }

  (0, _invariant2.default)(previousFocusedChildIndex >= 0, '"previousFocusTarget" is not a descendant of "focusableContainer"');

  var nextFocusTargetIndex = previousFocusedChildIndex - 1;

  if (nextFocusTargetIndex < 0) {
    return null;
  }

  return focusableChildren[nextFocusTargetIndex];
}