function Controller() {
  //
  var pubsubList = [];
  var register = (topic, foo) => {
    var newTopicObj = {};
    newTopicObj.topic = topic;
    newTopicObj.foos = [];
    newTopicObj.foos.push(foo);
    pubsubList.push(newTopicObj);
  };
  var publish = (topic) => {
    for (var i = 0; i < pubsubList.length; i++) {
      if (pubsubList[i].topic == topic) {
        pubsubList[i].foos.forEach((foo) => {
          foo();
        });
      }
    }
  };

  return {
    register: (topic, foo) => {
      register(topic, foo);
    },
    publish: (topic) => {
      publish(topic);
    },
  };
}

var controller = new Controller();

function updateCycle(interface, controller) {
  controller.register("pause", () => {
    clearInterval(cycleInterval);
  });
  controller.register("reset", () => {
    clearInterval(cycleInterval);
    sec_elem.updateUnit(0);
    min_elem.updateUnit(1);
    multiplier_elem.updateUnit(1);
  });

  var sec_value;
  var min_value;
  var multiplier_value;
  var sec_elem = interface.sec;
  var min_elem = interface.min;
  var multiplier_elem = interface.multiplier;
  var sec_init = interface.sec.getUnitValue;
  var min_init = interface.min.getUnitValue;
  var multiplier_init = interface.multiplier.getUnitValue;
  var cycleInterval = setInterval(() => {
    sec_value = interface.sec.getUnitValue;
    min_value = interface.min.getUnitValue;
    multiplier_value = interface.multiplier.getUnitValue;

    if (multiplier_value >= 1) {
      if (min_value == 0 && sec_value == 0) {
        multiplier_value -= 1;
        min_value = min_init;
        sec_value = sec_init + 1;
        document.querySelector("#roundCompleted").play();
      }

      switch (sec_value) {
        case 0:
          sec_value = 60;
          min_value = min_value - 1;
        default:
          sec_value -= 1;
          break;
      }
      sec_elem.updateUnit(sec_value);
      min_elem.updateUnit(min_value);
      multiplier_elem.updateUnit(multiplier_value);
    } else {
      clearInterval(cycleInterval);
      sec_elem.updateUnit(sec_init);
      min_elem.updateUnit(min_init);
      multiplier_elem.updateUnit(multiplier_init);
      controller.publish("finished");
    }
  }, 1000);
}

var stopwatch = stopwatch(updateCycle, controller);

// stopBtn.addEventListener(eventType.click, stopwatch.pause());

function btn() {
  return {
    path: document.querySelector("#start"),
    animate: {},
  };
}

function stopwatch(updateCycle, controller) {
  var startPauseBtn = document.querySelector("#start");
  this.isPaused = true;
  const interface = {
    sec: sec,
    min: min,
    multiplier: multiplier,
  };
  var start_pause = () => {
    var p = new Promise((res, rej) => {
      var pressedTimeBtn_sec = 0;

      var startBtnPressTimer = setInterval(() => {
        pressedTimeBtn_sec += 0.1;
        if (pressedTimeBtn_sec >= 1) {
          res(pressedTimeBtn_sec);
        }
        if (pressedTimeBtn_sec == 0.5) {
          startPauseBtn.className = "resetAnimation";
          log("START RESET ANIMATION");
        }

        log(pressedTimeBtn_sec);
      }, 100);
      //
      var stopBtnPressTimer = () => {
        clearInterval(startBtnPressTimer);
      };

      var mouseUpEvent = startPauseBtn.addEventListener(eventType.up, () => {
        stopBtnPressTimer();
        rej();
      });
    });
    p.then(
      (time) => {
        log("reset");
        setTimeout(() => {
          startPauseBtn.className = "start";
          controller.publish("reset");
          this.spinner.classList.remove("circle");
          this.isPaused = !this.isPaused;
        }, 500);
      },
      () => {
        if (this.isPaused) {
          updateCycle(interface, controller);
          startPauseBtn.className = "pause";
          this.spinner.classList.add("circle");
          this.spinner.style.opacity = "1";

          this.isPaused = !this.isPaused;
        } else {
          controller.publish("pause");
          startPauseBtn.className = "start";
          this.isPaused = !this.isPaused;
          this.spinner.classList.remove("circle");
        }
      }
    );
  };
  function measureBtnPressTime() {}

  this.spinner = document.querySelector("[data-id=multiplier]#dragcircle");
  startPauseBtn.addEventListener(eventType.down, start_pause);
  var stopBtn = document.querySelector("#stop");

  controller.register("finished", () => {
    start_pause();
  });
}
