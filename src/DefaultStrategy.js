class DefaultStrategy {
  constructor() {
    this.selectedIndex = 0;
  }

  setFocusable (node, focusable) {
    this.selectedIndex = node._focusable.children.indexOf(focusable);
  }

  getPreferredFocusable (node) {
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getUpFocusable (node) {
    this.selectedIndex--;
    this.selectedIndex = Math.max(0, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getRightFocusable (node) {
    this.selectedIndex++;
    this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getDownFocusable (node) {
    this.selectedIndex++;
    this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getLeftFocusable (node) {
    this.selectedIndex--;
    this.selectedIndex = Math.max(0, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }
};

export default DefaultStrategy;