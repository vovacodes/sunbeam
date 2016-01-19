class VerticalStrategy {
  constructor() {
    this.selectedIndex = 0;
  }

  getPreferredFocusable (node) {
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getUpFocusable (node) {
    this.selectedIndex--;

    if (this.selectedIndex < 0) {
      this.selectedIndex = node._focusable.children.length - Math.abs(this.selectedIndex);
    }

    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getRightFocusable (node) {r
    return null;
  }

  getDownFocusable (node) {
    this.selectedIndex++;
    this.selectedIndex = this.selectedIndex % node._focusable.children.length;
    return node._focusable.children && node._focusable.children[this.selectedIndex] || null;
  }

  getLeftFocusable (node) {
    return null;
  }
};

export default VerticalStrategy;