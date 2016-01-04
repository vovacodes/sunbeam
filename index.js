module.exports = {
  FocusManager: require('./dist/FocusManager')['default'],
  Focusable: require('./dist/Focusable')['default'],
  FocusableContainer: require('./dist/FocusableContainer')['default'],
  FocusableTreeUtils: require('./dist/utils/FocusableTreeUtils'),
  Strategies: {
    horizontalIndexBasedFocusStrategy: require('./dist/strategies/horizontalIndexBasedFocusStrategy'),
    verticalIndexBasedFocusStrategy: require('./dist/strategies/verticalIndexBasedFocusStrategy')
  }
};
