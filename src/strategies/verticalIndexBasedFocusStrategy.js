class VerticalStrategy {
  constructor() {
    this.selectedIndex = 0;
  }

  getPreferredFocusable (node) {
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getUpFocusable (node) {
    this.selectedIndex--;
    this.selectedIndex = Math.max(0, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getRightFocusable (node) {r
    return null;
  }

  getDownFocusable (node) {
    this.selectedIndex++;
    this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getLeftFocusable (node) {
    return null;
  }
};

export default VerticalStrategy;