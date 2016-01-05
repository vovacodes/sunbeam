'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAncestorOf = isAncestorOf;
exports.findFocusableNode = findFocusableNode;
exports.forEachUpTheTree = forEachUpTheTree;
exports.findUpTheTree = findUpTheTree;
exports.reduceUpTheTree = reduceUpTheTree;
exports.getFocused = getFocused;
exports.findLowestCommonAncestor = findLowestCommonAncestor;
exports.addFocusableChild = addFocusableChild;
exports.removeFocusableFromTree = removeFocusableFromTree;
exports.getFocusableData = getFocusableData;
exports.getParent = getParent;
exports.getChildren = getChildren;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash.find');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.foreach');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.remove');

var _lodash6 = _interopRequireDefault(_lodash5);

var _StrategyUtils = require('./StrategyUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collector = function collector(array, value) {
  array.push(value);
  return array;
};
var push = function push(queue) {
  return function (focusable) {
    queue.push(focusable);
  };
};

function isAncestorOf(descendant, focusable) {
  return !!findUpTheTree(descendant, function (focusableNode) {
    return focusableNode === focusable;
  });
}

// Iteration and search

function findFocusableNode(rootFocusable, predicate) {
  var queue = [];
  var pushToQueue = push(queue);

  var currentFocusable = rootFocusable;
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    (0, _lodash4.default)(getFocusableData(currentFocusable).children, pushToQueue);

    currentFocusable = queue.shift();
  }
}

/**
 * calls iteratee for startFocusable and each ancestor of it
 * preliminary stops execution if iteratee explicitly returns "false"
 * @param startFocusable
 * @param iteratee
 */
function forEachUpTheTree(startFocusable, iteratee) {
  var shouldContinueIteration = true;
  var currentFocusable = startFocusable;
  while (currentFocusable && shouldContinueIteration !== false) {
    shouldContinueIteration = iteratee(currentFocusable);

    currentFocusable = getParent(currentFocusable);
  }
}

function findUpTheTree(startFocusable, predicate) {
  var currentFocusable = startFocusable;
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    currentFocusable = getParent(currentFocusable);
  }

  return null;
}

function reduceUpTheTree(startFocusable, reducer, initialValue) {
  var accumulator = initialValue;
  var currentFocusable = startFocusable;
  while (currentFocusable) {
    accumulator = reducer(accumulator, currentFocusable);
    currentFocusable = getParent(currentFocusable);
  }

  return accumulator;
}

function getFocused(startFocusable) {
  var accumulator = [];
  var currentFocusable = startFocusable;
  while (currentFocusable) {
    accumulator.push(currentFocusable);

    var strategy = (0, _StrategyUtils.getStrategy)(currentFocusable);

    if (strategy) {
      currentFocusable = strategy.getPreferredFocusable(currentFocusable);
    } else {
      currentFocusable = null;
    }
  }

  return accumulator;
}

function findLowestCommonAncestor(focusableA, focusableB) {
  // collect all ancestors of focusableA + focusableA itself
  var branchA = reduceUpTheTree(focusableA, collector, []);

  // collect all ancestors of focusableB + focusableB itself
  var branchB = reduceUpTheTree(focusableB, collector, []);

  // find the first ancestor of focusableA that is also in the list of the ancestors of focusableB
  return (0, _lodash2.default)(branchA, function (focusable) {
    return branchB.indexOf(focusable) >= 0;
  });
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
  if (!focusable) {
    return;
  }

  var focusableData = getFocusableData(focusable);
  var parentFocusable = getParent(focusable);

  if (parentFocusable) {
    (0, _lodash6.default)(getChildren(parentFocusable), focusable);
  }

  (0, _lodash4.default)(getChildren(focusable), removeFocusableFromTree);

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