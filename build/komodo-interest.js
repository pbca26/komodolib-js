"use strict";

// TODO: tiptime != 0 && nLockTime < tiptime
module.exports = function (locktime, value, height) {
  // value in sats
  var KOMODO_ENDOFERA = 7777777;
  var LOCKTIME_THRESHOLD = 500000000;
  var timestampDiff = Math.floor(Date.now() / 1000) - locktime - 777;
  var hoursPassed = Math.floor(timestampDiff / 3600);
  var minutesPassed = Math.floor((timestampDiff - hoursPassed * 3600) / 60);
  var secondsPassed = timestampDiff - hoursPassed * 3600 - minutesPassed * 60;
  var timestampDiffMinutes = timestampDiff / 60;
  var interest = 0;

  // calc interest
  if (height < KOMODO_ENDOFERA && locktime >= LOCKTIME_THRESHOLD) {
    if (timestampDiffMinutes >= 60) {
      if (height >= 1000000 && timestampDiffMinutes > 31 * 24 * 60) {
        timestampDiffMinutes = 31 * 24 * 60;
      } else {
        if (timestampDiffMinutes > 365 * 24 * 60) {
          timestampDiffMinutes = 365 * 24 * 60;
        }
        timestampDiffMinutes -= 59;

        // TODO: check if interest is > 5% yr
        // calc ytd and 5% for 1 yr
        // const hoursInOneYear = 365 * 24;
        // const hoursDiff = hoursInOneYear - hoursPassed;

        interest = (Number(value) * 0.00000001 / 10512000 * timestampDiffMinutes).toFixed(8);
      }
    }
  }

  return interest;
};