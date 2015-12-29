'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFocusableNode = findFocusableNode;
exports.forEachUpTheTree = forEachUpTheTree;
exports.addFocusableChild = addFocusableChild;
exports.removeFocusableFromTree = removeFocusableFromTree;
exports.getFocusableData = getFocusableData;
exports.getParent = getParent;
exports.getChildren = getChildren;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.remove');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var push = function push(queue) {
  return function (focusable) {
    queue.push(focusable);
  };
};

// Iteration and search

function findFocusableNode(rootFocusable, predicate) {
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

/**
 * calls iteratee for startFocusable and each ancestor of it
 * @param startFocusable
 * @param iteratee
 */
function forEachUpTheTree(startFocusable, iteratee) {
  var currentFocusable = startFocusable;
  while (currentFocusable) {
    iteratee(currentFocusable);

    currentFocusable = getParent(currentFocusable);
  }
}

// Tree modifications

function addFocusableChild(parentFocusable, childFocusable) {
  var parentFocusableData = getFocusableData(parentFocusable);
  var childFocusableData = getFocusableData(childFocusable);

  if (!parentFocusableData.children) {
    parentFocusableData.children = [];
  }
  parentFocusableData.children.push(childFocusable);

  childFocusableData.parent = parentFocusable;
}

function removeFocusableFromTree(focusable) {
  var focusableData = getFocusableData(focusable);
  var parentFocusable = getParent(focusable);

  if (parentFocusable) {
    (0, _lodash4.default)(getChildren(parentFocusable), focusable);
  }

  (0, _lodash2.default)(getChildren(focusable), removeFocusableFromTree);

  focusableData.parent = null;
  focusableData.children = null;
}

// Getters

function getFocusableData(focusable) {
  (0, _invariant2.default)(focusable._focusable, 'there is no "_focusable" property on focusable: ' + focusable);

  return focusable._focusable;
}

function getParent(focusable) {
  return getFocusableData(focusable).parent;
}

function getChildren(focusable) {
  return getFocusableData(focusable).children;
}