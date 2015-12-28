'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFocusableDescendant = findFocusableDescendant;
exports.addFocusableChild = addFocusableChild;
exports.getFocusableData = getFocusableData;
exports.getParent = getParent;

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var push = function push(queue) {
  return function (focusable) {
    queue.push(focusable);
  };
};

function findFocusableDescendant(rootFocusable, predicate) {
  var queue = [rootFocusable];
  var pushToQueue = push(queue);

  var currentFocusable = queue.shift();
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    (0, _lodash2.default)(getFocusableData(currentFocusable).children, pushToQueue);

    currentFocusable = queue.shift();
  }
}

function addFocusableChild(parentFocusable, childFocusable) {
  var parentFocusableData = getFocusableData(parentFocusable);
  var childFocusableData = getFocusableData(childFocusable);

  (0, _invariant2.default)(parentFocusableData, 'there is no "_focusable" property on parentFocusable: ' + parentFocusable);
  (0, _invariant2.default)(childFocusableData, 'there is no "_focusable" property on childFocusable: ' + childFocusable);

  if (!parentFocusableData.children) {
    parentFocusableData.children = [];
  }
  parentFocusableData.children.push(childFocusable);

  childFocusableData.parent = parentFocusable;
}

/* export function removeFocusableChild(parentFocusable, childFocusable) {
  const parentFocusableData = getFocusableData(parentFocusable);
  const childFocusableData = getFocusableData(childFocusable);

  invariant(parentFocusableData, `there is no "_focusable" property on parentFocusable: ${parentFocusable}`);
  invariant(childFocusableData, `there is no "_focusable" property on childFocusable: ${childFocusable}`);
} */

// Getters

function getFocusableData(focusable) {
  (0, _invariant2.default)(focusable._focusable, 'there is no "_focusable" property on focusable: ' + focusable);

  return focusable._focusable;
}

function getParent(focusable) {
  (0, _invariant2.default)(focusable._focusable, 'there is no "_focusable" property on focusable: ' + focusable);

  return getFocusableData(focusable).parent;
}