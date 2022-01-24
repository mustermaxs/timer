function eventType() {
  this.isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  var click = this.isMobile ? "touchstart" : "click";
  var down = this.isMobile ? "touchstart" : "mousedown";
  var up = this.isMobile ? "touchend" : "mouseup";
  var move = this.isMobile ? "touchmove" : "mousemove";

  return {
    click: click,
    down: down,
    up: up,
    move: move,
    positionX: (ev) => {
      return this.isMobile ? ev.touches[0].clientX : ev.pageX;
    },
  };
}
