function Countdown(startingTime = { min: 0, sec: 0 }) {
  var min, sec, multiplier;

  //   var min_0 = startingTime.min;
  this.secRemaining = startingTime.sec;
  this.minRemaining = startingTime.min;

  //   var totalSeconds = min_0 * 60 + sec_0;
  var cycle = setInterval(() => {
    this.secRemaining = this.secRemaining > 0 ? (this.secRemaining -= 1) : 59;
    this.minRemaining =
      this.secRemaining === 0 ? (this.minRemaining -= 1) : this.minRemaining;
    console.log(`${this.minRemaining} : ${this.secRemaining}`);
  }, 1000);
  console.log("STOP");
}
