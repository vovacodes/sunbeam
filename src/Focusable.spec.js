import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { getMountedInstance } from 'react-shallow-testutils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import proxyquire from 'proxyquire';

expect.extend(expectJSX);

const mockRequire = proxyquire.noPreserveCache();

describe('Focusable', () => {
  let Focusable;
  let mockFocusManager = {
    'default': {
      registerFocusable: expect.createSpy(),
      deregisterFocusable: expect.createSpy()
    }
  };

  beforeEach(() => {
    Focusable = mockRequire('./Focusable', {
      './FocusManager': mockFocusManager
    }).default;
  });

  afterEach(() => {
    expect.restoreSpies();
  });

  describe('lifecycle', () => {

    it('should register itself with FocusManager in "componentWillMount" and provide "parentFocusableId" from the parent context', () => {
      let renderer = createRenderer();
      let context = { parentFocusableId: 'someId' };

      renderer.render(<Focusable/>, context);
      let focusableInstance = getMountedInstance(renderer);

      expect(mockFocusManager.default.registerFocusable).toHaveBeenCalledWith(focusableInstance, context.parentFocusableId);
    });

    it('should deregister itself from FocusManager in "componentWillUnmount"', () => {
      let renderer = createRenderer();

      renderer.render(<Focusable/>);
      let focusableInstance = getMountedInstance(renderer);
      renderer.unmount();

      expect(mockFocusManager.default.deregisterFocusable).toHaveBeenCalledWith(focusableInstance);
    });

  });

  describe('rendering', () => {

    // TODO: test that Focusable has a single child only
    it('should always render its children', () => {
      let renderer = createRenderer();

      renderer.render((
          <Focusable>
            <strong>test</strong>
          </Focusable>
      ));

      let actualElement = renderer.getRenderOutput();
      let expectedElement = (
          <span>
        <strong>test</strong>
      </span>
      );

      expect(actualElement).toEqualJSX(expectedElement);
    });

  });

  describe('API', () => {
    it('should have "componentDidReceiveFocus" method', () => {
      let renderer = createRenderer();

      renderer.render(<Focusable />);
      let focusableInstance = getMountedInstance(renderer);

      expect(focusableInstance.componentDidReceiveFocus).toBeA('function');
    });
  });

});
