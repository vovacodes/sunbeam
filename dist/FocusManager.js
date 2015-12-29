'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash.matchesproperty');

var _lodash2 = _interopRequireDefault(_lodash);

var _FocusableTreeUtils = require('./utils/FocusableTreeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focusTree = {};

exports.default = {

  // provide read-only access to focusTree for debugging and testing purposes only
  get _focusTree() {
    return focusTree;
  },

  initializeFocus: function initializeFocus() {
    var root = focusTree.root;

    if (!root) {
      return;
    }

    var preferredFocusable = recursivelyGetPreferredFocusable(root);

    (0, _FocusableTreeUtils.forEachUpTheTree)(preferredFocusable, function (focusable) {
      focusable.props.onFocus && focusable.props.onFocus();
      focusable.componentDidReceiveFocus();
    });

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
  doUp: function doUp() {},
  doRight: function doRight() {},
  doDown: function doDown() {},
  doLeft: function doLeft() {},
  doSelect: function doSelect() {}
};

function recursivelyGetPreferredFocusable(node) {
  if (!node.getPreferredFocusable) {
    return node;
  }

  var preferredFocusable = node.getPreferredFocusable(node);

  return recursivelyGetPreferredFocusable(preferredFocusable);
}