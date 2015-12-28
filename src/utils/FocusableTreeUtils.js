import forEach from 'lodash.foreach';

const push = (queue) => (focusable) => {
  queue.push(focusable);
};

export function findFocusableDescendant(rootFocusable, predicate) {
  const queue = [rootFocusable];
  const pushToQueue = push(queue);

  let currentNode = queue.shift();
  while (currentNode) {
    if (predicate(currentNode)) {
      return currentNode;
    }

    forEach(currentNode._focusable.children, pushToQueue);

    currentNode = queue.shift();
  }
}

export function addFocusableChild(parentFocusable, childFocusable) {
  if (!parentFocusable._focusable) {
    throw new Error(`there is no "_focusable" property on parentFocusable: ${parentFocusable}`);
  }

  if (!parentFocusable._focusable.children) {
    parentFocusable._focusable.children = [];
  }

  parentFocusable._focusable.children.push(childFocusable);
}
