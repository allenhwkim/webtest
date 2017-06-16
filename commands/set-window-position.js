'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_NUM  = '([0-9]+)';

module.exports = {
  name: 'set window position',
  help: 'set window position <left> <top>',
  regExp: new RegExp(`^set window position ${RE_NUM} ${RE_NUM}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(x, y) {
      let window = webtestDriver.driver.manage().window();
      return window.setPosition(parseInt(x), parseInt(y));
    }
};
