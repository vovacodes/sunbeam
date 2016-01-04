# sunbeam
Focus management system for TV applications

Focus management algorithm 
---

+ Components should somehow (mixin, class or higher order function) extend or Focusable or FocusableContainer.
+ When Focusable willComponentMount it adds itself to a tree structure described as a component._focusable.parent and component._focusable.children of components
+ Now we have a tree. We need to go in-depth and determine the lowest focusable element we have.
+ Getting preferred focusable element is done by calling getPreferredFocusable on component strategy
+ Definition of strategy. Strategy is any JS object having 5 methods:
  - getPreferredFocusable(parentComponent, previousFocusTarget) : React.Component
  - getLeftFocusable(parentComponent, previousFocusTarget) : React.Component
  - getRightFocusable(parentComponent, previousFocusTarget) : React.Component
  - getUpFocusable(parentComponent, previousFocusTarget) : React.Component
  - getDownFocusable(parentComponent, previousFocusTarget) : React.Component

+ How to get component focus strategy, falling back in following order:
  + Strategy could be received from component.getFocusStrategy method
  + Strategy could be passed as props.focusStrategy
  + Strategy could be described as component`s methods (component is a strategy)
  + Default spacial + index based?

+ After components are mounted we call getLowestPossibleFocusable
+ Then having lowest leaf available we build a path to it
+ Having a path we go through it and execute focus callback on every element which got focus
+ Executing focus callbacks means executing: executeFocusCallbacks(component)
  + component.componentWillReceiveFocus <- component developer hook
  + component.props.onFocus <- component user function
  + component.componentDidReceiveFocus <- component developer hook
+ If component was unmounted or lost focus we execute:
  + component.componentWillLoseFocus <- component developer hook
  + component.props.onBlur <- component user function
  + component.componentDidLoseFocus <- component developer hook
  + and we invalidate whole focus tree again #12
+ If branch of tree was removed we go to #7

+ If we receive event of left/right/down/up
  + We call current lowest container`s strategy for next component in this direction
  + We expect React.Component or null
  + If we receive component we blur current and focus new one
  + If we receive null we go one level up to next container and execute it`s strategy corresponding method

TODO Index for items which are not at correct position

Inspired by:
---
- https://developer.apple.com/library/prerelease/tvos/documentation/General/Conceptual/AppleTV_PG/WorkingwiththeAppleTVRemote.html
- http://nerds.airbnb.com/tvos-focus-engine/
- http://www.slideshare.net/EvanMaloney/tvos-the-focus-engine-and-swift
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/TVs_connected_devices/TV_remote_control_navigation
