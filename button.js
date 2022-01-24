class Button {
  constructor(config) {
    this.button = config.jsPath;
    this.isRunning = true;
  }
  update() {
    this.isRunning
      ? (this.startAnimation(), (this.isRunning = !this.isRunning))
      : (this.isRunningAnimation(), (this.isRunning = !this.isRunning));
  }
  startAnimation() {
    this.button.className = "start";
  }
  isRunningAnimation() {
    this.button.className = "pause";
  }
  resetAnimation() {
    this.button.className = "resetAnimation";
    this.isRunning = true;
    this.update();
  }
  /**
   * @param {Boolean} state
   */
  set buttonStateIsPause(state) {
    this.isRunning = state;
  }
}
