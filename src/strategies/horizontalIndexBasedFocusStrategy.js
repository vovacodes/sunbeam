class HorizontalStrategy {
  constructor() {
    this.selectedIndex = 0;
  }

  getPreferredFocusable (node) {
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getUpFocusable (node) {
    return null;
  }

  getRightFocusable (node) {
    this.selectedIndex++;
    this.selectedIndex = Math.min(node._focusable.children.length, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getDownFocusable (node) {
    return null;
  }

  getLeftFocusable (node) {
    this.selectedIndex--;
    this.selectedIndex = Math.max(0, this.selectedIndex);
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }
};

export default HorizontalStrategy;