const utils = {
  mapRange: (val, in_min, in_max, out_min, out_max) => {
    return Math.floor(
      ((val - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  },
};
