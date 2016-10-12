'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_NUM  = '([0-9]+[s]?)';

module.exports = {
  name: 'set speed',
  help: 'set speed <speed>',
  regExp: new RegExp(`^set speed ${RE_NUM}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(num) {
      let speed  = num.match(/s$/) ? parseInt(num) * 1000 : parseInt(num);
      seleniumWebTestDriver.config.speed = speed;
      return seleniumWebTestDriver.driver.executeScript('void(0)');
    }
};
