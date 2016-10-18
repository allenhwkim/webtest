'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_NUM  = '([0-9]+)';
const RE_UNIT = '([mill]*second[s]?)';

module.exports = {
  name: 'set speed',
  help: 'set speed <speed> seconds',
  regExp: new RegExp(`^set speed ${RE_NUM} ${RE_UNIT}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(num, unit) {
      let speed;
      if (unit.match(/^second/)) {
        speed = parseInt(num) * 1000;
      } else if (unit.match(/^millisecond/)) {
        speed =  parseInt(num);
      }
      seleniumWebTestDriver.config.speed = speed;
      return seleniumWebTestDriver.driver.executeScript('void(0)');
    }
};
