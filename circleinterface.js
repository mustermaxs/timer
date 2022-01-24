class CircleIF {
  constructor(config) {
    this.interfaceHitBox = config.interface;
    this.circle = config.circle;
    this.rail = config.rail;
    this.number = config.jsSelectorNumber;
    this.unit = config.unit;
    this.update = CircleIF.getDefaultUnitValues(this.unit);
    this.maxUnitValue = CircleIF.getUnitMaxValue(this.unit);
    this.circleSize = this.circleDimensions;
    this.isHighlighted = false;
    this.spinnerIsActive = false;

    this.setupInterface();
  }

  updateUnit(value) {
    this.number.textContent = this.helpers.convertUnitValueToString(value);
  }

  get circleDimensions() {
    return {
      x: this.circle.getBBox().x,
      y: this.circle.getBBox().y,
      w: this.circle.getBBox().width,
      posX: this.circle.getBoundingClientRect().x,
      len: this.circle.getTotalLength(),
    };
  }
  spinnerAnimation() {
    this.spinnerIsActive
      ? ((this.circle.className = ""),
        (this.spinnerIsActive = !this.spinnerIsActive))
      : ((this.circle.className = "spinner"),
        (this.spinnerIsActive = !this.spinnerIsActive));
    return this.spinnerIsActive;
  }

  calcCircleDashArray(mappedMousePos) {
    var values = {
      stroke: (
        this.circleSize.len -
        utils.mapRange(mappedMousePos, 0, 150, 0, this.circleSize.len)
      ).toString(),
      gap: this.circleSize.len.toString(),
    };
    return `${values.stroke} ${values.gap}`;
  }
  calcRailLength(calculatedrailSize) {
    this.rail.style.y = calculatedrailSize.y;
    this.rail.style.x = calculatedrailSize.x;
  }

  /**
   * @param {String} timeInteger
   */
  set time(timeInteger) {
    this.timeInteger = timeInteger;
  }
  setupInterface() {
    //
    this.rail.style.y = Math.floor(this.circleSize.w / 2).toString();
    this.rail.style.x = (this.circleSize.w + 1.5).toString();
    const railStartingPointX = 49;
    var logMousePos = (ev) => {
      this.mousePos = eventType.positionX(ev);
    };
    var mousedown = (ev) => {
      this.interval = setInterval(() => {
        log(this.mousePos);
        // this.mapMousePosition(this.mousePos);
        var mappedMousePos = this.mapMousePosition(this.mousePos);
        this.drawCircle(mappedMousePos);
        this.drawRail(mappedMousePos);
        this.circleIsVisible = true;
      }, 100);
      document.addEventListener(eventType.move, logMousePos);
    };

    this.interfaceHitBox.addEventListener(eventType.down, mousedown);
    this.interfaceHitBox.addEventListener(eventType.down, mousedown);
    document.addEventListener(eventType.up, () => {
      this.circleIsVisible = false;
      //   this.mapMousePosition(this.mousePos);
      this.drawCircle(this.mousePos);
      this.drawRail(this.mousePos);

      document.removeEventListener(eventType.down, mousedown);
      document.removeEventListener("mousemove", logMousePos);
      clearInterval(this.interval);
      log(eventType.up);
    });
  }
  mapMousePosition(mousePosX) {
    //
    const railStartingPointX = 49;
    var mousePosRelToCircle =
      mousePosX - railStartingPointX - this.circleSize.posX;
    switch (true) {
      case mousePosRelToCircle <= 0 || typeof mousePosRelToCircle !== "number":
        // log("case 2")
        mousePosRelToCircle = 0;
        break;
      case mousePosRelToCircle >= 150:
        mousePosRelToCircle = 150;
        break;
      default:
        break;
    }
    return mousePosRelToCircle;
  }
  drawCircle(mappedMousePos) {
    if (this.circleIsVisible) {
      log("mappedMousePos: " + mappedMousePos);
      var measures = this.calcCircleDashArray(mappedMousePos);
      log(measures);
      this.circle.style.opacity = "1";
      this.circle.setAttribute("stroke-dasharray", measures);
      return;
    }
    this.circle.style.opacity = "0";
  }
  drawRail(mappedMousePos) {
    if (this.circleIsVisible) {
      this.setUnitValue = this.helpers.mapUnit(mappedMousePos);
      this.rail.style.opacity = "1";
      log("WIDTH: " + mappedMousePos);
      log("RAIL X: " + this.rail.style.x);
      this.rail.setAttribute("width", mappedMousePos.toString());
      return;
    }
    this.rail.style.opacity = "0";
  }

  static getUnitMaxValue(unit) {
    const maxValues = {
      sec: 60,
      min: 10,
      multiplier: 10,
    };
    return maxValues[unit];
  }
  static getDefaultUnitValues(unit) {
    const defaultValues = {
      sec: 0,
      min: 0,
      multiplier: 1,
    };
    return defaultValues[unit];
  }
  /**
   * @param {Integer} value
   */
  set setUnitValue(value) {
    //
    this.unitValue = value;
    this.updateUnit(this.unitValue);
  }

  get getUnitValue() {
    return parseInt(this.number.textContent);
  }

  get helpers() {
    return {
      mapUnit: (value) => {
        var mappedUnitValue = utils.mapRange(
          value,
          0,
          150,
          0,
          this.maxUnitValue
        );
        return mappedUnitValue;
      },
      convertUnitValueToString: (value) => {
        var valueFormatted;
        log("VALUE: " + typeof value);
        switch (true) {
          case value < 10:
            valueFormatted = "0" + value.toString();
            break;
          /*           case typeof value !== "number":
            valueFormatted = "00";
            break; */
          default:
            valueFormatted = value.toString();
            break;
        }
        return valueFormatted;
      },
      convertUnitValueToInt: (value) => {},
    };
  }
}
