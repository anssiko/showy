Object.defineProperty(HTMLElement.prototype, 'hidden', {
  get: function get() {
    return (this.style.display === 'none') ? true : false;
  },
  set: function set(v) {
    this.style.display = v ? 'none' : 'block';
  },
  configurable: true
});