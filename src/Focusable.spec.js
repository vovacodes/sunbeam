import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
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

  it('should register itself with FocusManager in "componentWillMount"', () => {
    let renderer = createRenderer();

    renderer.render(<Focusable/>);

    expect(mockFocusManager.default.registerFocusable).toHaveBeenCalled();
  });

  it('should unregister itself from FocusManager in "componentWillUnmount"', () => {
    let renderer = createRenderer();

    renderer.render(<Focusable/>);
    renderer.unmount();

    expect(mockFocusManager.default.deregisterFocusable).toHaveBeenCalled();
  });

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
