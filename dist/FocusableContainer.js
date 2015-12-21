'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.uniqueid');

var _lodash2 = _interopRequireDefault(_lodash);

var _FocusManager = require('./FocusManager');

var _FocusManager2 = _interopRequireDefault(_FocusManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FocusableContainer = (function (_React$Component) {
  _inherits(FocusableContainer, _React$Component);

  function FocusableContainer(props) {
    _classCallCheck(this, FocusableContainer);

    // create a storage for all Focusable-related props

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FocusableContainer).call(this, props));

    _this._focusable = {};

    // assign a unique focusableId to be identifiable inside the FocusManager
    _this._focusable.focusableId = (0, _lodash2.default)('FocusableContainer');
    return _this;
  }

  _createClass(FocusableContainer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        parentFocusableId: this._focusable.focusableId
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      _FocusManager2.default.registerFocusable(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _FocusManager2.default.deregisterFocusable(this);
    }

    // =============== focusStrategy methods =====================

  }, {
    key: 'getPreferredFocusable',
    value: function getPreferredFocusable() {
      return this.props.focusStrategy.getPreferredFocusable();
    }
  }, {
    key: 'moveFocusUp',
    value: function moveFocusUp() {
      return this.props.focusStrategy.moveFocusUp();
    }
  }, {
    key: 'moveFocusRight',
    value: function moveFocusRight() {
      return this.props.focusStrategy.moveFocusRight();
    }
  }, {
    key: 'moveFocusDown',
    value: function moveFocusDown() {
      return this.props.focusStrategy.moveFocusDown();
    }
  }, {
    key: 'moveFocusLeft',
    value: function moveFocusLeft() {
      return this.props.focusStrategy.moveFocusLeft();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        null,
        this.props.children
      );
    }
  }]);

  return FocusableContainer;
})(_react2.default.Component);

FocusableContainer.childContextTypes = {
  parentFocusableId: _react2.default.PropTypes.string
};
FocusableContainer.propTypes = {
  children: _react2.default.PropTypes.element,
  focusStrategy: _react2.default.PropTypes.shape({
    getPreferredFocusable: _react2.default.PropTypes.func,
    moveFocusUp: _react2.default.PropTypes.func,
    moveFocusDown: _react2.default.PropTypes.func,
    moveFocusLeft: _react2.default.PropTypes.func,
    moveFocusRight: _react2.default.PropTypes.func
  })
};

exports.default = FocusableContainer;