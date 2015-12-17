import FocusManager from './FocusManager';
import expect from 'expect';

describe('FocusManager', () => {

  // property? current focus target

  describe('API', () => {
    describe('initializeFocus', () => {
      xit('should have "initializeFocus" method', () => {
        expect(FocusManager.initializeFocus).toExist();
      });
    });

    it('should have "registerFocusable" method', () => {
      expect(FocusManager.registerFocusable).toExist();
    });

    it('should have "deregisterFocusable" method', () => {
      expect(FocusManager.deregisterFocusable).toExist();
    });

    it('should have "doUp" method', () => {
      expect(FocusManager.doUp).toExist();
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
