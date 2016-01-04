'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStrategy = getStrategy;
exports.isStrategy = isStrategy;

var _DefaultStrategy = require('../DefaultStrategy');

var _DefaultStrategy2 = _interopRequireDefault(_DefaultStrategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStrategy(focusable) {
  if (focusable) {
    var result = focusable._focusable.strategy;

    if (!result) {
      if (typeof focusable.getFocusStrategy === 'function') {
        result = focusable.getFocusStrategy();
        //Trying to get strategy from props
      } else if (focusable.props && focusable.props.focusStrategy && isStrategy(focusable.props.focusStrategy)) {
          result = focusable.props.focusStrategy;
          //If fail then trying to use component methods as a strategy
        } else if (isStrategy(focusable)) {
            result = focusable;
          } else {
            //If fail then trying to use DefaultStrategy
            result = new _DefaultStrategy2.default();
          }
      //Then assign strategy to component to prevent passong through this conditions for next time
      focusable._focusable.strategy = result;
    }

    return focusable._focusable.strategy;
  }
}

function isStrategy(objectToCheck) {
  return typeof objectToCheck.getPreferredFocusable === 'function' && (typeof objectToCheck.getLeftFocusable === 'function' || typeof objectToCheck.getRightFocusable === 'function' || typeof objectToCheck.getUpFocusable === 'function' || typeof objectToCheck.getDownFocusable === 'function');
}