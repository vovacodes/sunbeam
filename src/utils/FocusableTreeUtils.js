import invariant from 'invariant';
import find from 'lodash.find';
import forEach from 'lodash.foreach';
import remove from 'lodash.remove';

const collector = (array, value) => {
  array.push(value);
  return array;
};
const push = (queue) => (focusable) => {
  queue.push(focusable);
};

export function isAncestorOf(descendant, focusable) {
  return !!findUpTheTree(descendant, (focusableNode) => focusableNode === focusable);
}

// Iteration and search

export function findFocusableNode(rootFocusable, predicate) {
  const queue = [];
  const pushToQueue = push(queue);

  let currentFocusable = rootFocusable;
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    forEach(getFocusableData(currentFocusable).children, pushToQueue);

    currentFocusable = queue.shift();
  }
}

/**
 * calls iteratee for startFocusable and each ancestor of it
 * preliminary stops execution if iteratee explicitly returns "false"
 * @param startFocusable
 * @param iteratee
 */
export function forEachUpTheTree(startFocusable, iteratee) {
  let shouldContinueIteration = true;
  let currentFocusable = startFocusable;
  while (currentFocusable && shouldContinueIteration !== false) {
    shouldContinueIteration = iteratee(currentFocusable);

    currentFocusable = getParent(currentFocusable);
  }
}

export function findUpTheTree(startFocusable, predicate) {
  let currentFocusable = startFocusable;
  while (currentFocusable) {
    if (predicate(currentFocusable)) {
      return currentFocusable;
    }

    currentFocusable = getParent(currentFocusable);
  }

  return null;
}

export function reduceUpTheTree(startFocusable, reducer, initialValue) {
  let accumulator = initialValue;
  let currentFocusable = startFocusable;
  while (currentFocusable) {
    accumulator = reducer(accumulator, currentFocusable);

    currentFocusable = getParent(currentFocusable);
  }

  return accumulator;
}

export function findLowestCommonAncestor(focusableA, focusableB) {
  // collect all ancestors of focusableA + focusableA itself
  const branchA = reduceUpTheTree(focusableA, collector, []);

  // collect all ancestors of focusableB + focusableB itself
  const branchB = reduceUpTheTree(focusableB, collector, []);

  // find the first ancestor of focusableA that is also in the list of the ancestors of focusableB
  return find(branchA, (focusable) => {
    return branchB.indexOf(focusable) >= 0;
  });
}

// Tree modifications

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
