import FocusManager from '../src/FocusManager';
import expect from 'expect';

describe('FocusManager', () => {

  it('should have "getInitialFocus" method', () => {
    expect(FocusManager.getInitialFocus).toExist();
  });

});