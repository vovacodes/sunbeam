import forEach from 'lodash.foreach';
import invariant from 'invariant';

const push = (queue) => (focusable) => {
  queue.push(focusable);
};

export function findFocusableDescendant(rootFocusable, predicate) {
  const queue = [rootFocusable];
  const pushToQueue = push(queue);

  let currentFocusable = queue.shift();
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    forEach(getFocusableData(currentFocusable).children, pushToQueue);

    currentFocusable = queue.shift();
  }
}

export function addFocusableChild(parentFocusable, childFocusable) {
  const parentFocusableData = getFocusableData(parentFocusable);
  const childFocusableData = getFocusableData(childFocusable);

  invariant(parentFocusableData, `there is no "_focusable" property on parentFocusable: ${parentFocusable}`);
  invariant(childFocusableData, `there is no "_focusable" property on childFocusable: ${childFocusable}`);

  if (!parentFocusableData.children) {
    parentFocusableData.children = [];
  }
  parentFocusableData.children.push(childFocusable);

  childFocusableData.parent = parentFocusable;
}

/* export function removeFocusableChild(parentFocusable, childFocusable) {
  const parentFocusableData = getFocusableData(parentFocusable);
  const childFocusableData = getFocusableData(childFocusable);

  invariant(parentFocusableData, `there is no "_focusable" property on parentFocusable: ${parentFocusable}`);
  invariant(childFocusableData, `there is no "_focusable" property on childFocusable: ${childFocusable}`);
} */

// Getters

export function getFocusableData(focusable) {
  invariant(focusable._focusable, `there is no "_focusable" property on focusable: ${focusable}`);

  return focusable._focusable;
}

export function getParent(focusable) {
  invariant(focusable._focusable, `there is no "_focusable" property on focusable: ${focusable}`);

  return getFocusableData(focusable).parent;
}
