import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-addons-test-utils';
import { getMountedInstance } from 'react-shallow-testutils';
import { findFocusableNode, getFocusableData, getChildren } from './utils/FocusableTreeUtils';
import FocusManager from './FocusManager';

// ================== test harnesses ==========================

class TestFocusable extends React.Component {
  constructor() {
    super();
    this._focusable = {};
  }
  componentDidReceiveFocus() {}
  render() {
    return null;
  }
}

class TestFocusableContainer extends React.Component {
  constructor() {
    super();
    this._focusable = {};
  }
  getPreferredFocusable(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.getPreferredFocusable(focusableContainer, previousFocusTarget);
  }
  moveFocusUp(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusUp(focusableContainer, previousFocusTarget);
  }
  moveFocusRight(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusRight(focusableContainer, previousFocusTarget);
  }
  moveFocusDown(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusDown(focusableContainer, previousFocusTarget);
  }
  moveFocusLeft(focusableContainer, previousFocusTarget) {
    return this.props.focusStrategy.moveFocusLeft(focusableContainer, previousFocusTarget);
  }
  componentDidReceiveFocus() {}
  render() {
    return null;
  }
}

function createInstanceOfComponent(ComponentClass, props) {
  const renderer = createRenderer();
  renderer.render(<ComponentClass {...props} />);

  return getMountedInstance(renderer);
}

// =============================================================

describe('FocusManager', () => {

  // property? current focus target

  describe('API', () => {

    afterEach(() => {
      // clear the focusTree
      FocusManager._focusTree.root = null;
    });

    describe('initializeFocus', () => {
      let parentComponentInstance, childComponentInstance, grandChildComponentInstance;

      const parentFocusStrategy = {
        getPreferredFocusable(focusableContainer, previousFocusTarget) {
          return getChildren(focusableContainer)[0];
        }
      };
      const childFocusStrategy = {
        getPreferredFocusable(focusableContainer, previousFocusTarget) {
          return getChildren(focusableContainer)[0];
        }
      };
      const parentGetPreferredFocusableSpy = expect.spyOn(parentFocusStrategy, 'getPreferredFocusable').andCallThrough();
      const childGetPreferredFocusableSpy = expect.spyOn(childFocusStrategy, 'getPreferredFocusable').andCallThrough();

      beforeEach(() => {
        const focusTree = FocusManager._focusTree;
        parentComponentInstance = createInstanceOfComponent(TestFocusableContainer, {
          focusStrategy: parentFocusStrategy,
          onFocus: expect.createSpy()
        });
        childComponentInstance = createInstanceOfComponent(TestFocusableContainer, {
          focusStrategy: childFocusStrategy,
          onFocus: expect.createSpy()
        });
        grandChildComponentInstance = createInstanceOfComponent(TestFocusable, {
          onFocus: expect.createSpy()
        });

        expect.spyOn(parentComponentInstance, 'componentDidReceiveFocus');
        expect.spyOn(childComponentInstance, 'componentDidReceiveFocus');
        expect.spyOn(grandChildComponentInstance, 'componentDidReceiveFocus');

        // manually build focusTree
        getFocusableData(grandChildComponentInstance).focusableId = 'randomGrandChild';
        getFocusableData(grandChildComponentInstance).parent = childComponentInstance;
        getFocusableData(childComponentInstance).focusableId = 'randomChild';
        getFocusableData(childComponentInstance).parent = parentComponentInstance;
        getFocusableData(childComponentInstance).children = [ grandChildComponentInstance ];
        getFocusableData(parentComponentInstance).focusableId = 'randomParent';
        getFocusableData(parentComponentInstance).children = [ childComponentInstance ];

        focusTree.root = parentComponentInstance;
      });

      afterEach(() => {
        expect.restoreSpies();
      });

      it('should recursively call "getPreferredFocusable" starting from the root node', () => {
        FocusManager.initializeFocus();

        expect(parentGetPreferredFocusableSpy).toHaveBeenCalled();
        expect(childGetPreferredFocusableSpy).toHaveBeenCalled();
      });

      it('should save preferredFocusable as "focusTarget"', () => {
        FocusManager.initializeFocus();

        expect(FocusManager._focusTree.focusTarget).toBe(grandChildComponentInstance);
      });

      it('should call "props.onFocus" and "componentDidReceiveFocus" for focusTarget and each of its ancestors', () => {
        FocusManager.initializeFocus();

        expect(grandChildComponentInstance.props.onFocus).toHaveBeenCalled();
        expect(grandChildComponentInstance.componentDidReceiveFocus).toHaveBeenCalled();

        expect(childComponentInstance.props.onFocus).toHaveBeenCalled();
        expect(childComponentInstance.componentDidReceiveFocus).toHaveBeenCalled();

        expect(parentComponentInstance.props.onFocus).toHaveBeenCalled();
        expect(parentComponentInstance.componentDidReceiveFocus).toHaveBeenCalled();
      });
    });

    describe('registerFocusable', () => {

      it('should place component in the root of the _focusTree if tree is empty', () => {
        const testComponentInstance = createInstanceOfComponent(TestFocusable);

        FocusManager.registerFocusable(testComponentInstance);

        expect(FocusManager._focusTree.root).toBe(testComponentInstance);
      });

      it('should register component as a child of the container with "focusableId" equal to provided "parentFocusableId"', () => {
        const parentComponentInstance = createInstanceOfComponent(TestFocusable);
        const childComponentInstance = createInstanceOfComponent(TestFocusable);
        const parentFocusableId = 'some id';

        parentComponentInstance._focusable.focusableId = parentFocusableId;

        FocusManager.registerFocusable(parentComponentInstance);
        FocusManager.registerFocusable(childComponentInstance, parentFocusableId);

        expect(parentComponentInstance._focusable.children[0]).toBe(childComponentInstance);
        expect(childComponentInstance._focusable.parent).toBe(parentComponentInstance);
      });

      it('should throw if there is no component with "focusableId" equal to provided "parentFocusableId" in the tree', () => {
        const parentComponentInstance = createInstanceOfComponent(TestFocusable);
        const childComponentInstance = createInstanceOfComponent(TestFocusable);
        const parentFocusableId = 'some id';
        const wrongParentFocusableId = parentFocusableId + 'lets break it';

        parentComponentInstance._focusable.focusableId = parentFocusableId;

        FocusManager.registerFocusable(parentComponentInstance);
        expect(() => FocusManager.registerFocusable(childComponentInstance, wrongParentFocusableId))
            .toThrow(/there is no focusableContainer with focusableId:/);
      });

      it("should throw if root isn't vacant and there is no 'parentFocusableId' provided", () => {
        const parentComponentInstance = createInstanceOfComponent(TestFocusable);
        const childComponentInstance = createInstanceOfComponent(TestFocusable);

        FocusManager.registerFocusable(parentComponentInstance);

        expect(() => FocusManager.registerFocusable(childComponentInstance))
            .toThrow(/"parentFocusableId" is not provided, but root component in the tree is already defined/);
      });

    });

    describe('deregisterFocusable', () => {

      let parentComponentInstance, childComponentInstance, grandChildComponentInstance;

      beforeEach(() => {
        const focusTree = FocusManager._focusTree;
        parentComponentInstance = createInstanceOfComponent(TestFocusable);
        childComponentInstance = createInstanceOfComponent(TestFocusable);
        grandChildComponentInstance = createInstanceOfComponent(TestFocusable);

        // manually build focusTree
        getFocusableData(grandChildComponentInstance).focusableId = 'randomGrandChild';
        getFocusableData(grandChildComponentInstance).parent = childComponentInstance;
        getFocusableData(childComponentInstance).focusableId = 'randomChild';
        getFocusableData(childComponentInstance).parent = parentComponentInstance;
        getFocusableData(childComponentInstance).children = [ grandChildComponentInstance ];
        getFocusableData(parentComponentInstance).focusableId = 'randomParent';
        getFocusableData(parentComponentInstance).children = [ childComponentInstance ];

        focusTree.root = parentComponentInstance;
      });

      it('should remove focusable from the _focusTree if it is there, links to parent and children should be nullified', () => {
        // check if childComponentInstance is really in the tree and tree has correct structure
        const foundFocusable = findFocusableNode(
            FocusManager._focusTree.root,
            (focusable) => focusable === childComponentInstance
        );
        expect(foundFocusable).toBe(childComponentInstance);

        FocusManager.deregisterFocusable(childComponentInstance);

        // there shouldn't be childComponentInstance in the tree anymore
        const result = findFocusableNode(
            FocusManager._focusTree.root,
            (focusable) => focusable === childComponentInstance
        );
        expect(result).toNotExist();
        expect(getFocusableData(childComponentInstance).parent).toNotExist();
        expect(getFocusableData(childComponentInstance).children).toNotExist();
      });

    });

    describe('doUp', () => {
      let parentComponentInstance, childComponentInstance, grandChildComponentInstance;

      beforeEach(() => {
        const parentFocusStrategy = {
          getPreferredFocusable(focusableContainer, previousFocusTarget) {
            return getChildren(focusableContainer)[0];
          },
          moveFocusUp(focusableContainer, previousFocusTarget) {
            return null;
          }
        };
        const childFocusStrategy = {
          getPreferredFocusable(focusableContainer, previousFocusTarget) {
            return getChildren(focusableContainer)[0];
          },
          moveFocusUp(focusableContainer, previousFocusTarget) {
            return null;
          }
        };

        const focusTree = FocusManager._focusTree;
        parentComponentInstance = createInstanceOfComponent(TestFocusableContainer, {
          focusStrategy: parentFocusStrategy
        });
        childComponentInstance = createInstanceOfComponent(TestFocusableContainer, {
          focusStrategy: childFocusStrategy
        });
        grandChildComponentInstance = createInstanceOfComponent(TestFocusable, {
          onFocus: expect.createSpy()
        });

        // manually build focusTree
        getFocusableData(grandChildComponentInstance).focusableId = 'randomGrandChild';
        getFocusableData(grandChildComponentInstance).parent = childComponentInstance;
        getFocusableData(childComponentInstance).focusableId = 'randomChild';
        getFocusableData(childComponentInstance).parent = parentComponentInstance;
        getFocusableData(childComponentInstance).children = [ grandChildComponentInstance ];
        getFocusableData(parentComponentInstance).focusableId = 'randomParent';
        getFocusableData(parentComponentInstance).children = [ childComponentInstance ];

        focusTree.root = parentComponentInstance;
        focusTree.focusTarget = grandChildComponentInstance;
      });

      it(`should call "moveFocusUp" method of focusableContainers up the tree until one of them returns a not-null result or root is reached`, () => {
        expect.spyOn(childComponentInstance, 'moveFocusUp').andReturn(null);
        expect.spyOn(parentComponentInstance, 'moveFocusUp').andReturn(childComponentInstance);

        FocusManager.doUp();

        expect(childComponentInstance.moveFocusUp).toHaveBeenCalledWith(childComponentInstance, grandChildComponentInstance);
        expect(parentComponentInstance.moveFocusUp).toHaveBeenCalledWith(parentComponentInstance, grandChildComponentInstance);
      });

      it('if nextFocusTarget, returned by one of the recursive "moveFocusUp" calls, is a FocusableContainer, ' +
          'getPreferredFocusable should be recursively called down its tree ' +
          'to get the focusable that becomes new focusTarget', () => {
        expect.spyOn(childComponentInstance, 'moveFocusUp').andReturn(null);
        expect.spyOn(parentComponentInstance, 'moveFocusUp').andReturn(childComponentInstance);
        expect.spyOn(childComponentInstance, 'getPreferredFocusable').andCallThrough();

        FocusManager.doUp();

        expect(childComponentInstance.getPreferredFocusable).toHaveBeenCalled();
      });

      it(`if calls of "moveFocusUp" returned the current focusTarget it shouldn't do anything`, () => {
        expect.spyOn(childComponentInstance, 'moveFocusUp').andReturn(grandChildComponentInstance);
        expect.spyOn(grandChildComponentInstance, 'componentDidReceiveFocus');
        const prevFocusTarget = FocusManager._focusTree.focusTarget;

        FocusManager.doUp();
        const newFocusTarget = FocusManager._focusTree.focusTarget;

        expect(prevFocusTarget).toBe(newFocusTarget);
        expect(grandChildComponentInstance.componentDidReceiveFocus).toNotHaveBeenCalled();
        expect(grandChildComponentInstance.props.onFocus).toNotHaveBeenCalled();
      });

      it(`if calls of "moveFocusUp" recursively returned null it shouldn't do anything`, () => {
        expect.spyOn(childComponentInstance, 'moveFocusUp').andReturn(null);
        expect.spyOn(parentComponentInstance, 'moveFocusUp').andReturn(null);
        expect.spyOn(grandChildComponentInstance, 'componentDidReceiveFocus');
        const prevFocusTarget = FocusManager._focusTree.focusTarget;

        FocusManager.doUp();
        const newFocusTarget = FocusManager._focusTree.focusTarget;

        expect(prevFocusTarget).toBe(newFocusTarget);
        expect(grandChildComponentInstance.componentDidReceiveFocus).toNotHaveBeenCalled();
        expect(grandChildComponentInstance.props.onFocus).toNotHaveBeenCalled();
      });

    });

    it('should have "doRight" method', () => {
      expect(FocusManager.doRight).toExist();
    });

    it('should have "doDown" method', () => {
      expect(FocusManager.doDown).toExist();
    });

    it('should have "doLeft" method', () => {
      expect(FocusManager.doLeft).toExist();
    });

    it('should have "doSelect" method', () => {
      expect(FocusManager.doSelect).toExist();
    });
  });

});
