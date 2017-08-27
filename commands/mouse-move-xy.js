'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_NUM    = '([\-0-9]+)';

module.exports = {
  name: 'move mouse xy',
  help: 'move mouse x <num> y <num>',
  regExp: new RegExp(`^move mouse x ${RE_NUM} y ${RE_NUM}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(xAmt, yAmt) {
      let directionObj = {x: parseInt(xAmt), y: parseInt(yAmt)};
      return webtestDriver.driver.actions().
        mouseMove(directionObj).perform();
    }
};
