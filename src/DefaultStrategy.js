class DefaultStrategy {
  getPreferredFocusable (node) {
    this.selectedIndex = 0;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getUpFocusable (node) {
    this.selectedIndex++;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getRightFocusable (node) {
    this.selectedIndex++;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getDownFocusable (node) {
    this.selectedIndex++;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getLeftFocusable (node) {
    this.selectedIndex++;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }
};

export default DefaultStrategy;