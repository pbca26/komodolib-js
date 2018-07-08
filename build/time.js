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
  var currentEpochTime = Date.now() / 1000;
  var secondsElapsed = Number(currentEpochTime) - Number(dateToCheck / 1000);

  return Math.floor(secondsElapsed);
};

var secondsElapsedToString = function secondsElapsedToString(timestamp) {
  // in seconds
  var secondsElapsed = checkTimestamp(timestamp);
  var hours = Math.floor(timestamp / 3600);
  var minutes = Math.floor((timestamp - hours * 3600) / 60);
  var seconds = timestamp - hours * 3600 - minutes * 60;
  var returnTimeVal = (hours > 0 ? hours + ' hour(s) ' : '') + (minutes > 0 ? minutes + ' minute(s) ' : '') + (seconds > 0 ? seconds + ' second(s) ' : '');

  return returnTimeVal;
};

module.exports = {
  secondsToString: secondsToString,
  checkTimestamp: checkTimestamp,
  secondsElapsedToString: secondsElapsedToString
};