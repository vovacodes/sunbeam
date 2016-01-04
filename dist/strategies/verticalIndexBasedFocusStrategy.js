'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FocusableTreeUtils = require('../utils/FocusableTreeUtils');

var _IndexBasedStartegyUtils = require('../utils/IndexBasedStartegyUtils');

exports.default = {
  getPreferredFocusable: function getPreferredFocusable(focusableContainer, previousFocusTarget) {
    var focusableChildren = (0, _FocusableTreeUtils.getChildren)(focusableContainer);

    return focusableChildren[0];
  },

  moveFocusUp: _IndexBasedStartegyUtils.getPrecedingFocusableChild,

  moveFocusDown: _IndexBasedStartegyUtils.getSubsequentFocusableChild,

  moveFocusRight: function moveFocusRight(focusableContainer, previousFocusTarget) {
    return null;
  },
  moveFocusLeft: function moveFocusLeft(focusableContainer, previousFocusTarget) {
    return null;
  }
};