'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_NUM  = '([0-9]+)';
const RE_UNIT = '( second| seconds| millisecond| milliseconds)?';

/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'wait for a period',
  help: 'sleep <num> milliseconds',
  regExp: new RegExp(`^sleep ${RE_NUM}${RE_UNIT}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(num, unit) {
      unit = unit || 'milliseconds';
      let milliSec = unit.match(/^second/) ? parseInt(num) * 1000 : parseInt(num);
      return webtestDriver.driver.sleep(milliSec);
    }
};
