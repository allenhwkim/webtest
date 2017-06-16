'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_NUM  = '([0-9]+)?';
const RE_UNIT = '(second|seconds|millisecond|milliseconds)?';
const resetSpeed = webtestDriver.config.speed;

module.exports = {
  name: '(re)set speed',
  help: '(re)set speed <speed> seconds',
  regExp: new RegExp(`^(set|reset) speed[ ]?${RE_NUM}[ ]?${RE_UNIT}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(command, num, unit) {
      let speed;
      if (command === 'reset') {
        speed = resetSpeed;
      } else if (unit.match(/^second/)) {
        speed = parseInt(num) * 1000;
      } else if (unit.match(/^millisecond/)) {
        speed =  parseInt(num);
      } 
      webtestDriver.config.speed = speed;
      console.log('seting speed to', speed);
      return webtestDriver.driver.executeScript('void(0)');
    }
};
