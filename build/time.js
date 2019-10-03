'use strict';

var secondsToString = function secondsToString(seconds, skipMultiply, showSeconds) {
  var a = new Date(seconds * (skipMultiply ? 1 : 1000));
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + (showSeconds ? ':' + sec : '');

  return time;
};

var checkTimestamp = function checkTimestamp(dateToCheck) {
  var currentEpochTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now() / 1000;

  var secondsElapsed = Number(currentEpochTime) - Number(dateToCheck / 1000);

  return Math.floor(secondsElapsed);
};

// src: https://stackoverflow.com/questions/8942895/convert-a-number-of-days-to-days-months-and-years-with-jquery/8943500
var secondsElapsedToString = function secondsElapsedToString(timestamp, srcInSeconds) {
  // in seconds
  var secondsElapsed = srcInSeconds ? timestamp : checkTimestamp(timestamp);
  var str = '';
  // Map lengths of `secondsElapsed` to different time periods
  var oneDay = 24 * 3600;
  var values = [{
    str: ' year',
    num: 365 * oneDay
  }, {
    str: ' month',
    num: 30 * oneDay
  }, {
    str: ' week',
    num: 7 * oneDay
  }, {
    str: ' day',
    num: 1 * oneDay
  }, {
    str: ' hour',
    num: 3600
  }, {
    str: ' minute',
    num: 60
  }, {
    str: ' second',
    num: 1
  }];

  // Iterate over the values...
  for (var i = 0; i < values.length; i++) {
    var _value = Math.floor(secondsElapsed / values[i].num);

    // ... and find the largest time value that fits into the secondsElapsed
    if (_value >= 1) {
      // If we match, add to the string ('s' is for pluralization)
      str += _value + values[i].str + (_value > 1 ? 's' : '') + ' ';

      // and subtract from the secondsElapsed
      secondsElapsed -= _value * values[i].num;
    }
  }

  return str;
};

module.exports = {
  secondsToString: secondsToString,
  checkTimestamp: checkTimestamp,
  secondsElapsedToString: secondsElapsedToString
};