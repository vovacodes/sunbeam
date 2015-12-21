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

    it('should register itself with FocusManager in "componentWillMount"', () => {
      let renderer = createRenderer();

      renderer.render(<Focusable/>);
      let focusableElement = getMountedInstance(renderer);

      expect(mockFocusManager.default.registerFocusable).toHaveBeenCalledWith(focusableElement);
    });

    it('should deregister itself from FocusManager in "componentWillUnmount"', () => {
      let renderer = createRenderer();

      renderer.render(<Focusable/>);
      let focusableElement = getMountedInstance(renderer);
      renderer.unmount();

      expect(mockFocusManager.default.deregisterFocusable).toHaveBeenCalledWith(focusableElement);
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

});
