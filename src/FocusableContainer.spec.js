import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { getMountedInstance } from 'react-shallow-testutils';
import expect from 'expect';
import proxyquire from 'proxyquire';

const mockRequire = proxyquire.noPreserveCache();

describe('FocusableContainer', () => {
  let FocusableContainer;
  let mockFocusManager = {
    'default': {
      registerFocusable: expect.createSpy(),
      deregisterFocusable: expect.createSpy()
    }
  };
  let mockFocusStrategy = {
    getPreferredFocusable: expect.createSpy(),
    moveFocusUp: expect.createSpy(),
    moveFocusRight: expect.createSpy(),
    moveFocusDown: expect.createSpy(),
    moveFocusLeft: expect.createSpy()
  };


  beforeEach(() => {
    FocusableContainer = mockRequire('./FocusableContainer', {
      './FocusManager': mockFocusManager
    }).default;
  });

  afterEach(() => {
    expect.restoreSpies();
  });

  describe('lifecycle', () => {

    it('should register itself with FocusManager in "componentWillMount" and provide "parentFocusableId" from the parent context', () => {
      let renderer = createRenderer();
      let context = { parentFocusableId: 'parentContainerId' };

      renderer.render(<FocusableContainer/>, context);
      let focusableContainerElement = getMountedInstance(renderer);

      expect(mockFocusManager.default.registerFocusable).toHaveBeenCalledWith(focusableContainerElement, context.parentFocusableId);
    });

    it('should deregister itself from FocusManager in "componentWillUnmount"', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer/>);
      let focusableContainerElement = getMountedInstance(renderer);
      renderer.unmount();

      expect(mockFocusManager.default.deregisterFocusable).toHaveBeenCalledWith(focusableContainerElement);
    });

  });

  describe('rendering', () => {

    it('should always render its children', () => {
      let renderer = createRenderer();

      renderer.render((
          <FocusableContainer>
            <strong>test</strong>
          </FocusableContainer>
      ));

      let actualElement = renderer.getRenderOutput();
      let expectedElement = (
          <span>
          <strong>test</strong>
        </span>
      );

      expect(actualElement).toEqualJSX(expectedElement);
    });

    it('should pass its "parentFocusableId" to its children through context', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer/>);

      let focusableContainerElement = getMountedInstance(renderer);
      let childContext = focusableContainerElement.getChildContext();

      expect(childContext.parentFocusableId).toBeA('string');
    });

  });

  describe('API', () => {

    it('should have "getPreferredFocusable" method that delegates to the strategy', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer focusStrategy={mockFocusStrategy} />);
      let focusableContainerElement = getMountedInstance(renderer);
      focusableContainerElement.getPreferredFocusable();

      expect(mockFocusStrategy.getPreferredFocusable).toHaveBeenCalled();
    });

    it('should have "moveFocusUp" method that delegates to the strategy', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer focusStrategy={mockFocusStrategy} />);
      let focusableContainerElement = getMountedInstance(renderer);
      focusableContainerElement.moveFocusUp();

      expect(mockFocusStrategy.moveFocusUp).toHaveBeenCalled();
    });

    it('should have "moveFocusRight" method that delegates to the strategy', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer focusStrategy={mockFocusStrategy} />);
      let focusableContainerElement = getMountedInstance(renderer);
      focusableContainerElement.moveFocusRight();

      expect(mockFocusStrategy.moveFocusRight).toHaveBeenCalled();
    });

    it('should have "moveFocusDown" method that delegates to the strategy', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer focusStrategy={mockFocusStrategy} />);
      let focusableContainerElement = getMountedInstance(renderer);
      focusableContainerElement.moveFocusDown();

      expect(mockFocusStrategy.moveFocusDown).toHaveBeenCalled();
    });

    it('should have "moveFocusLeft" method that delegates to the strategy', () => {
      let renderer = createRenderer();

      renderer.render(<FocusableContainer focusStrategy={mockFocusStrategy} />);
      let focusableContainerElement = getMountedInstance(renderer);
      focusableContainerElement.moveFocusLeft();

      expect(mockFocusStrategy.moveFocusLeft).toHaveBeenCalled();
    });

  });
});
