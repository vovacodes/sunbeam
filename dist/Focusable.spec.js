'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _expectJsx = require('expect-jsx');

var _expectJsx2 = _interopRequireDefault(_expectJsx);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_expect2.default.extend(_expectJsx2.default);

var mockRequire = _proxyquire2.default.noPreserveCache();

describe('Focusable', function () {
  var Focusable = undefined;
  var mockFocusManager = {
    'default': {
      registerFocusable: _expect2.default.createSpy(),
      deregisterFocusable: _expect2.default.createSpy()
    }
  };

  beforeEach(function () {
    Focusable = mockRequire('./Focusable', {
      './FocusManager': mockFocusManager
    }).default;
  });

  afterEach(function () {
    _expect2.default.restoreSpies();
  });

  it('should register itself with FocusManager in "componentWillMount"', function () {
    var renderer = (0, _reactAddonsTestUtils.createRenderer)();

    renderer.render(_react2.default.createElement(Focusable, null));

    (0, _expect2.default)(mockFocusManager.default.registerFocusable).toHaveBeenCalled();
  });

  it('should unregister itself from FocusManager in "componentWillUnmount"', function () {
    var renderer = (0, _reactAddonsTestUtils.createRenderer)();

    renderer.render(_react2.default.createElement(Focusable, null));
    renderer.unmount();

    (0, _expect2.default)(mockFocusManager.default.deregisterFocusable).toHaveBeenCalled();
  });

  // TODO: test that Focusable has a single child only
  it('should always render its children', function () {
    var renderer = (0, _reactAddonsTestUtils.createRenderer)();

    renderer.render(_react2.default.createElement(
      Focusable,
      null,
      _react2.default.createElement(
        'strong',
        null,
        'test'
      )
    ));

    var actualElement = renderer.getRenderOutput();
    var expectedElement = _react2.default.createElement(
      'span',
      null,
      _react2.default.createElement(
        'strong',
        null,
        'test'
      )
    );

    (0, _expect2.default)(actualElement).toEqualJSX(expectedElement);
  });
});