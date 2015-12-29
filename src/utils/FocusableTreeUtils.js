import invariant from 'invariant';
import forEach from 'lodash.foreach';
import remove from 'lodash.remove';

const push = (queue) => (focusable) => {
  queue.push(focusable);
};

export function findFocusableNode(rootFocusable, predicate) {
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

  if (!parentFocusableData.children) {
    parentFocusableData.children = [];
  }
  parentFocusableData.children.push(childFocusable);

  childFocusableData.parent = parentFocusable;
}

export function removeFocusableFromTree(focusable) {
  const focusableData = getFocusableData(focusable);
  const parentFocusable = getParent(focusable);

  if (parentFocusable) {
    remove(getChildren(parentFocusable), focusable);
  }

  forEach(getChildren(focusable), removeFocusableFromTree);

  focusableData.parent = null;
  focusableData.children = null;
}

// Getters

export function getFocusableData(focusable) {
  invariant(focusable._focusable, `there is no "_focusable" property on focusable: ${focusable}`);

  return focusable._focusable;
}

export function getParent(focusable) {
  return getFocusableData(focusable).parent;
}

export function getChildren(focusable) {
  return getFocusableData(focusable).children;
}
