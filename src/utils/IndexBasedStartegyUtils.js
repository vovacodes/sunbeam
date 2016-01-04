import invariant from 'invariant';
import findIndex from 'lodash.findindex';
import { isAncestorOf, getChildren } from './FocusableTreeUtils';

export function getSubsequentFocusableChild(focusableContainer, previousFocusTarget) {
  const focusableChildren = getChildren(focusableContainer);

  let previousFocusedChildIndex = focusableChildren.indexOf(previousFocusTarget);
  if (previousFocusedChildIndex === -1) {
    // previousFocusTarget is not a direct child of focusableContainer
    // let's find the index of a child that is the ancestor of previousFocusTarget
    previousFocusedChildIndex = findIndex(focusableChildren, (focusableChild) => isAncestorOf(previousFocusTarget, focusableChild));
  }

  invariant(previousFocusedChildIndex >= 0, '"previousFocusTarget" is not a descendant of "focusableContainer"');

  const nextFocusTargetIndex = previousFocusedChildIndex + 1;

  if (nextFocusTargetIndex > focusableChildren.length - 1) {
    return null;
  }

  return focusableChildren[nextFocusTargetIndex];
}

export function getPrecedingFocusableChild(focusableContainer, previousFocusTarget) {
  const focusableChildren = getChildren(focusableContainer);

  let previousFocusedChildIndex = focusableChildren.indexOf(previousFocusTarget);
  if (previousFocusedChildIndex === -1) {
    // previousFocusTarget is not a direct child of focusableContainer
    // let's find the index of a child that is the ancestor of previousFocusTarget
    previousFocusedChildIndex = findIndex(focusableChildren, (focusableChild) => isAncestorOf(previousFocusTarget, focusableChild));
  }

  invariant(previousFocusedChildIndex >= 0, '"previousFocusTarget" is not a descendant of "focusableContainer"');

  const nextFocusTargetIndex = previousFocusedChildIndex - 1;

  if (nextFocusTargetIndex < 0) {
    return null;
  }

  return focusableChildren[nextFocusTargetIndex];
}
