"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VerticalStrategy = (function () {
  function VerticalStrategy() {
    _classCallCheck(this, VerticalStrategy);

    this.selectedIndex = 0;
  }

  _createClass(VerticalStrategy, [{
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
      r;
      return null;
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
      return null;
    }
  }]);

  return VerticalStrategy;
})();

;

exports.default = VerticalStrategy;