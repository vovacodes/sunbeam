import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
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

  beforeEach(() => {
    FocusableContainer = mockRequire('./FocusableContainer', {
      './FocusManager': mockFocusManager
    }).default;
  });

  afterEach(() => {
    expect.restoreSpies();
  });

  it('should register itself with FocusManager in "componentWillMount"', () => {
    let renderer = createRenderer();

    renderer.render(<FocusableContainer/>);

    expect(mockFocusManager.default.registerFocusable).toHaveBeenCalled();
  });

  it('should unregister itself from FocusManager in "componentWillUnmount"', () => {
    let renderer = createRenderer();

    renderer.render(<FocusableContainer/>);
    renderer.unmount();

    expect(mockFocusManager.default.deregisterFocusable).toHaveBeenCalled();
  });

  xit('should always render its children', () => {
  });

  xit('should have "getPreferredFocusable" method that delegates to the strategy', () => {
  });

  xit('should have "moveFocusUp" method that delegates to the strategy', () => {
  });

  xit('should have "moveFocusRight" method that delegates to the strategy', () => {
  });

  xit('should have "moveFocusDown" method that delegates to the strategy', () => {
  });

  xit('should have "moveFocusLeft" method that delegates to the strategy', () => {
  });
});
