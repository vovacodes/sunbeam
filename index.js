module.exports = {
  FocusManager: require('./dist/FocusManager')['default'],
  Focusable: require('./dist/Focusable')['default'],
  FocusableContainer: require('./dist/FocusableContainer')['default'],
  FocusableTreeUtils: require('./dist/utils/FocusableTreeUtils'),
  strategies: {
    horizontalIndexBasedFocusStrategy: require('./dist/strategies/horizontalIndexBasedFocusStrategy')['default'],
    verticalIndexBasedFocusStrategy: require('./dist/strategies/verticalIndexBasedFocusStrategy')['default']
  }
};
