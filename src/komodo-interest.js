module.exports = (locktime, value) => { // value in sats
  const timestampDiff = Math.floor(Date.now() / 1000) - locktime - 777;
  const hoursPassed = Math.floor(timestampDiff / 3600);
  const minutesPassed = Math.floor((timestampDiff - (hoursPassed * 3600)) / 60);
  const secondsPassed = timestampDiff - (hoursPassed * 3600) - (minutesPassed * 60);
  let timestampDiffMinutes = timestampDiff / 60;
  let interest = 0;

  // calc interest
  if (timestampDiffMinutes >= 60) {
    if (timestampDiffMinutes > 365 * 24 * 60) {
      timestampDiffMinutes = 365 * 24 * 60;
    }
    timestampDiffMinutes -= 59;

    // TODO: check if interest is > 5% yr
    // calc ytd and 5% for 1 yr
    // const hoursInOneYear = 365 * 24;
    // const hoursDiff = hoursInOneYear - hoursPassed;

    interest = (((Number(value) * 0.00000001) / 10512000) * timestampDiffMinutes).toFixed(8);
  }

  return interest;
};