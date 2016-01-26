"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultStrategy = (function () {
  function DefaultStrategy() {
    _classCallCheck(this, DefaultStrategy);

    this.selectedIndex = 0;
  }

  _createClass(DefaultStrategy, [{
    key: "setFocusable",
    value: function setFocusable(node, focusable) {
      this.selectedIndex = node._focusable.children.indexOf(focusable);
    }
  }, {
    key: "getPreferredFocusable",
    value: function getPreferredFocusable(node) {
      return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
    }
  }, {
    key: "getUpFocusable",
    value: function getUpFocusable(node) {
      this.selectedIndex--;
      this.selectedIndex = Math.max(0, this.selectedIndex);
      return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
    }
  }, {
    key: "getRightFocusable",
    value: function getRightFocusable(node) {
      this.selectedIndex++;
      this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
      return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
    }
  }, {
    key: "getDownFocusable",
    value: function getDownFocusable(node) {
      this.selectedIndex++;
      this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
      return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
    }
  }, {
    key: "getLeftFocusable",
    value: function getLeftFocusable(node) {
      this.selectedIndex--;
      this.selectedIndex = Math.max(0, this.selectedIndex);
      return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
    }
  }]);

  return DefaultStrategy;
})();

;

exports.default = DefaultStrategy;