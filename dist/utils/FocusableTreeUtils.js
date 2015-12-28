'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFocusableDescendant = findFocusableDescendant;
exports.addFocusableChild = addFocusableChild;

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var push = function push(queue) {
  return function (focusable) {
    queue.push(focusable);
  };
};

function findFocusableDescendant(rootFocusable, predicate) {
  var queue = [rootFocusable];
  var pushToQueue = push(queue);

  var currentNode = queue.shift();
  while (currentNode) {
    if (predicate(currentNode)) {
      return currentNode;
    }

    (0, _lodash2.default)(currentNode._focusable.children, pushToQueue);

    currentNode = queue.shift();
  }
}

function addFocusableChild(parentFocusable, childFocusable) {
  if (!parentFocusable._focusable) {
    throw new Error('there is no "_focusable" property on parentFocusable: ' + parentFocusable);
  }

  if (!parentFocusable._focusable.children) {
    parentFocusable._focusable.children = [];
  }

  parentFocusable._focusable.children.push(childFocusable);
}