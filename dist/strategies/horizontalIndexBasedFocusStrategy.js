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
  moveFocusUp: function moveFocusUp(focusableContainer, previousFocusTarget) {
    return null;
  },
  moveFocusDown: function moveFocusDown(focusableContainer, previousFocusTarget) {
    return null;
  },

  moveFocusRight: _IndexBasedStartegyUtils.getSubsequentFocusableChild,

  moveFocusLeft: _IndexBasedStartegyUtils.getPrecedingFocusableChild
};