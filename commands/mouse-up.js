'use strict';
var webtestDriver = require('../src/web-test-driver');

module.exports = {
  name: 'mouse up',
  help: 'mouse up',
  regExp: new RegExp(`^mouse up`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function() {
      return webtestDriver.driver.actions().mouseUp().perform();
    }
};
