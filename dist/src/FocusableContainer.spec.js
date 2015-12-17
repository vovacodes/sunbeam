'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _FocusableContainer = require('./FocusableContainer');

var _FocusableContainer2 = _interopRequireDefault(_FocusableContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('FocusableContainer', function () {
  it('should exist', function () {
    (0, _expect2.default)(_FocusableContainer2.default).toExist();
  });

  xit('should register itself with FocusManager in "componentWillMount"', function () {});

  xit('should unregister itself from FocusManager in "componentWillUnmount"', function () {});

  xit('should always render its children', function () {});

  xit('should have "getPreferredFocusable" method that delegates to the strategy', function () {});

  xit('should have "moveFocusUp" method that delegates to the strategy', function () {});

  xit('should have "moveFocusRight" method that delegates to the strategy', function () {});

  xit('should have "moveFocusDown" method that delegates to the strategy', function () {});

  xit('should have "moveFocusLeft" method that delegates to the strategy', function () {});
});