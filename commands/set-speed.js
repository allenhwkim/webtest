'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_NUM  = '([0-9]+)?';
const RE_UNIT = '(second|seconds|millisecond|milliseconds)?';
const resetSpeed = seleniumWebTestDriver.config.speed;

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
      seleniumWebTestDriver.config.speed = speed;
      console.log('seting speed to', speed);
      return seleniumWebTestDriver.driver.executeScript('void(0)');
    }
};
