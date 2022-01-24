var clock = {
  min: document.querySelector("#min").textContent,
  sec: document.querySelector("#sec").textContent,
};
const draw = function (objs) {
  return new Promise((resolve_draw) => {
    objs.forEach((obj) => {
      var val = obj.val.toString();
      if (this.interface[obj.elem].textContent == val) {
        return;
      }
      if (obj.val < 10) {
        val = "0" + val;
      }
      this.interface[obj.elem].textContent = val;
    });
    resolve_draw();
  });
};

const countdown = function (interface) {
  //this.interface = interface;
  this.layout();
  this.interface.btn.addEventListener("click", () => {
    handleBtn.call(this);
  });
  this.interface.stop.addEventListener("click", () => {
    this.timerState = "stopped";
    handleBtn.call(this);
    this.draw([
      { elem: "min", val: this.min_init },
      { elem: "sec", val: this.sec_init },
      { elem: "multiplier", val: this.multiplier_init },
    ]);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key == " " && document.activeElement.tagName !== "SPAN") {
      console.log(document.activeElement.type);
      handleBtn.call(this);
    } else if (ev.key == "r") {
      this.draw([
        { elem: "min", val: this.min_init },
        { elem: "sec", val: this.sec_init },
        { elem: "multiplier", val: this.multiplier_init },
      ]);
    }
  });
  this.timerState = "start";

  const prepareAnim = function () {
    return new Promise((res) => {
      res();
      return;
      var getReadyDiv = document.querySelector(".getReady");
      var getReadyInt = document.querySelector("#getreadycountdown");
      getReadyInt.textContent = 3;

      getReadyDiv.classList.remove("deactivated");
      var c = 3;
      var prepAnimInterval = setInterval(() => {
        if (c != 0) {
          getReadyInt.textContent = c;
          //getReadyInt.style.fontSize = "2.5rem";
          c -= 1;
          return;
        }
        getReadyDiv.classList.add("deactivated");
        clearInterval(prepAnimInterval);
        res();
      }, 1000);
    });
  };

  this.start = function () {
    this.circle = this.interface.circle;
    prepareAnim().then(() => {
      this.circle.style.animationDuration = "1s";
      this.cycle = update.call(this);
      this.circle.classList.add("circle");
    });
  };
  this.stop = function () {
    //this.timerState = "start";
    clearInterval(this.cycle);
    this.circle.classList.remove("circle");
  };
  // setter für init schreiben
  var update = function () {
    this.min_init = parseInt(this.interface.min.textContent);
    this.sec_init = parseInt(this.interface.sec.textContent);
    this.multiplier_init = parseInt(this.interface.multiplier.textContent);
    count();
  };

  function handleBtn() {
    switch (this.timerState) {
      case "stopped":
        this.interface.btn.className = "start";
        this.timerState = "start";
        this.interface.btn.innerText = "Go!";

        this.stop();
        break;

      case "start":
        this.interface.btn.className = "pause";
        this.interface.btn.innerText = "Pause";
        this.timerState = "stopped";

        this.start();
        break;
    }
  }
  var count = () => {
    console.log(this);
    var interval = setInterval(() => {
      this.min_int = parseInt(this.interface.min.textContent);
      this.sec_int = parseInt(this.interface.sec.textContent);
      this.multiplier_int = parseInt(this.interface.multiplier.textContent);

      if (this.multiplier_int >= 1) {
        if (this.min_int == 0 && this.sec_int == 0) {
          this.multiplier_int -= 1;
          this.interface.audio.switch.play();
          animations.flicker.call(document.querySelector("body"));

          this.min_int = this.min_init;
          this.sec_int = this.sec_init + 1;
        }
        switch (this.sec_int) {
          case 0:
            this.sec_int = 60;
            this.min_int = this.min_int - 1;
          default:
            this.sec_int -= 1;
            break;
        }
        console.log(sec);
        console.log(this.min_int);
        this.draw([
          { elem: "min", val: this.min_int },
          { elem: "sec", val: this.sec_int },
          { elem: "multiplier", val: this.multiplier_int },
        ]);
      } else {
        clearInterval(this.cycle);
        this.draw([
          { elem: "min", val: this.min_init },
          { elem: "sec", val: this.sec_init },
          { elem: "multiplier", val: this.multiplier_init },
        ]);
        this.timerState = "stopped";
        handleBtn.call(this);
        this.circle.classList.remove("circle");
      }
    }, 1000);
    return interval;
  };
};
/* const count = () => {
  console.log(this);
  var interval = setInterval(() => {
    this.min_int = parseInt(this.interface.min.textContent);
    this.sec_int = parseInt(this.interface.sec.textContent);
    this.multiplier_int = parseInt(this.interface.multiplier.textContent);

    if (this.multiplier_int >= 1) {
      if (this.min_int == 0 && this.sec_int == 0) {
        this.multiplier_int -= 1;
        this.interface.audio.switch.play();
        animations.flicker.call(document.querySelector("body"));

        this.min_int = this.min_init;
        this.sec_int = this.sec_init + 1;
      }
      switch (this.sec_int) {
        case 0:
          this.sec_int = 60;
          this.min_int = this.min_int - 1;
        default:
          this.sec_int -= 1;
          break;
      }
      console.log(sec);
      console.log(this.min_int);
      this.draw([
        { elem: "min", val: this.min_int },
        { elem: "sec", val: this.sec_int },
        { elem: "multiplier", val: this.multiplier_int },
      ]);
    } else {
      clearInterval(this.cycle);
      this.draw([
        { elem: "min", val: this.min_init },
        { elem: "sec", val: this.sec_init },
        { elem: "multiplier", val: this.multiplier_init },
      ]);
      this.timerState = "stopped";
      handleBtn.call(this);
      this.circle.classList.remove("circle");
    }
  }, 1000);
  return interval;
}; */

const getCurrent = () => {
  this.interface.sec;
};

const animations = {
  flicker: function () {
    this.classList.add("flash");
    this.style.color = "black";
    setTimeout(() => {
      this.classList.remove("flash");
      this.style.color = "white";
    }, 300);
  },
};

const interface = {
  wrapper: document.querySelector("#wrapper"),
  sec: document.querySelector("#sec"),
  min: document.querySelector("#min"),
  multiplier: document.querySelector("#multiplier"),
  btn: document.querySelector("#start"),
  stop: document.querySelector("#stop"),
  circle: document.querySelector("#dragcircle[data-id=multiplier]"),
  audio: {
    switch: document.querySelector("audio"),
  },
};
const initialValues = {
  min: 1,
  sec: 0,
  multiplier: 1,
  buttonState: false,
};
countdown.prototype.draw = draw;
countdown.prototype.interface = interface;
// countdown.prototype.count = count;
countdown.prototype.layout = function () {
  document.querySelectorAll("span").forEach((span) => {
    //span.addEventListener("focus", (ev) => {if (ev.target.id == "tabindexloop") {document.querySelector("#multiplier").focus()} })
    span.addEventListener("change", (ev) => {
      if (ev.target.id != "multiplier") {
        if (ev.target.textContent.length == 0) {
          ev.target.textContent = "00";
        }
      } else {
        if (ev.target.textContent.length >= 2) {
          ev.target.style.left = "11px";
        } else {
          ev.target.style.left = "18px";
        }
      }
      ev.target.textContent = ev.target.textContent.replace(/[a-zA-Z\s]+?/, "");
    });
  });
};
var stopwatch = new countdown(interface);

const dragChange = function () {};
/*
        (function resize() {
            document.querySelectorAll("span").forEach((span) => {span.addEventListener("input", (ev) =>
            {
                if (ev.target.id != "multiplier") {
                    if (ev.target.textContent.length == 0) {
                        ev.target.textContent = "00";
                    }
                }
                else {
                    if (ev.target.textContent.length >= 2) {
                        ev.target.style.left = "11px"}
                        else {
                            ev.target.style.left = "18px"
                        }
                }
            })
        })
        })() */
