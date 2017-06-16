'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element not selected',
  help: 'verify element <selector> not selected',
  regExp: new RegExp(`^verify element ${RE_STR} [is ]*not selected`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    selector = selector.replace(/ is/g,'');
    return webtestDriver.waitUntil('elementIsNotSelected', selector)
      .then(el => webtestDriver.lastFoundElement = el);
  }
};
