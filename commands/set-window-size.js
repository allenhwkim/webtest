'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_NUM  = '([0-9]+)';

module.exports = {
  name: 'set window size',
  help: 'set window size <width> <height>',
  regExp: new RegExp(`^set window size ${RE_NUM} ${RE_NUM}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(width, height) {
      let window = webtestDriver.driver.manage().window();
      return window.setSize(parseInt(width), parseInt(height));
    }
};
